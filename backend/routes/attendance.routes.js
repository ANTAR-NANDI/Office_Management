const express = require("express");
const router = express.Router();


const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { Op } = require("sequelize");

router.get("/report", async (req, res) => {

    try {

        const { from, to, employee_id } = req.query;

        const where = {};

        if (employee_id) {
            where.employee_id = employee_id;
        }

        if (from && to) {
            where.date = {
                [Op.between]: [from, to]
            };
        }

        const attendances =
            await Attendance.findAll({
                where
            });

        const employees =
            await Employee.findAll();

        const result = employees.map(emp => {

            const employeeAttendance =
                attendances.filter(
                    a => a.employee_id === emp.id
                );

            return {
                employee_id: emp.id,
                employee_name: emp.name,
                designation: emp.designation,

                total_present:
                    employeeAttendance.filter(
                        a => a.status === "Present"
                    ).length,

                total_late:
                    employeeAttendance.filter(
                        a => a.status === "Late"
                    ).length,

                total_absent:
                    employeeAttendance.filter(
                        a => a.status === "Absent"
                    ).length
            };
        });

        res.json(result);
        console.log(result)

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/details/:employee_id", async (req, res) => {
    try {
        const attendanceRecords = await Attendance.findAll({
            where: {
                employee_id: req.params.employee_id
            },
            include: [
                {
                    model: Employee,
                    attributes: ["name", "designation"] // Only fetch what we need
                },
                

            ],
            order: [
                ["date", "DESC"]
            ]
        });
        console.log(attendanceRecords);

        // প্রতিটি রেকর্ডের সাথে duration হিসাব করে নতুন একটি অ্যারে তৈরি করা হচ্ছে
        const dataWithDuration = attendanceRecords.map(record => {
            // Sequelize instance-কে সাধারণ JavaScript Object-এ রূপান্তর
            const plainRecord = record.get({ plain: true }); 
            
            if (plainRecord.check_in && plainRecord.check_out) {
                // আজকের তারিখের সাথে সময় দুটিকে মিলিয়ে dummy Date অবজেক্ট তৈরি করা হচ্ছে
                const today = new Date().toISOString().split('T')[0];
                const checkInTime = new Date(`${today}T${plainRecord.check_in}`);
                const checkOutTime = new Date(`${today}T${plainRecord.check_out}`);

                // মিলিসেকেন্ডের পার্থক্য বের করা
                let diffInMs = checkOutTime - checkInTime;

                // যদি নাইট শিফট হয় (অর্থাৎ চেক-আউট পরের দিন সকাল বা মাঝরাতে হয়)
                if (diffInMs < 0) {
                    diffInMs += 24 * 60 * 60 * 1000; // ২৪ ঘণ্টা যোগ করা হলো
                }

                // মিলিসেকেন্ড থেকে ঘণ্টা ও মিনিটে রূপান্তর
                const totalMinutes = Math.floor(diffInMs / (1000 * 60));
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                // নতুন প্রোপার্টি হিসেবে অবজেক্টে যুক্ত করা হলো
                plainRecord.duration = `${hours}h ${minutes}m`;
                plainRecord.total_minutes = totalMinutes; // ফ্রন্টএন্ডে হিসাব সহজ করার জন্য
            } else {
                plainRecord.duration = "N/A";
                plainRecord.total_minutes = 0;
            }

            return plainRecord;
        });
        
        res.json(dataWithDuration);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
const Setting = require("../models/Setting"); // Import settings configuration rules
const { getDistanceInMeters } = require("../utils/geoFence"); // Import geo helper

// 🟢 CHECK-IN ROUTE WITH GEOFENCING保護
router.post("/checkin", async (req, res) => {
    try {
        const { employee_id, latitude, longitude } = req.body;

        // 1. Verify frontend coordinate transmissions exist
        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Location coordinates are required to check in." });
        }

        // 2. Fetch active company office geofence rule credentials
        const config = await Setting.findOne(); // Pulls the entry configurations row
        if (!config) {
            return res.status(500).json({ message: "System Error: Office Geofence rules are not configured." });
        }

        // 3. Compute distance boundary lines
        const calculatedDistance = getDistanceInMeters(
            parseFloat(latitude), 
            parseFloat(longitude), 
            parseFloat(config.latitude), 
            parseFloat(config.longitude)
        );
        console.log("Calculated Distance Is ",calculatedDistance);

        // 4. Evaluate radius breach check constraints
        if (calculatedDistance > config.radius) {
            return res.status(400).json({ 
                message: `Check-in failed. You are outside the office boundary (${Math.round(calculatedDistance)} meters away).` 
            });
        }

        // --- Rest of your original validation and creation code ---
        const now = new Date();
        const options = { timeZone: "Asia/Dhaka", hour12: false };
        const datePart = now.toLocaleDateString("en-CA", options);
        const timePart = now.toLocaleTimeString("en-US", options);

        const existing = await Attendance.findOne({ where: { employee_id, date: datePart } });
        if (existing) return res.status(400).json({ message: "Already checked in today" });

        const status = timePart <= "10:00:00" ? "Present" : "Late";
        const attendance = await Attendance.create({
            employee_id,
            date: datePart,
            check_in: timePart,
            status,
        });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🟢 CHECK-OUT ROUTE WITH GEOFENCING保護
router.post("/checkout", async (req, res) => {
    try {
        const { employee_id, latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Location coordinates are required to check out." });
        }

        const config = await Setting.findOne();
        if (!config) return res.status(500).json({ message: "Office Geofence rules are not configured." });

        const calculatedDistance = getDistanceInMeters(
            parseFloat(latitude), 
            parseFloat(longitude), 
            parseFloat(config.latitude), 
            parseFloat(config.longitude)
        );

        if (calculatedDistance > config.radius) {
            return res.status(400).json({ 
                message: `Check-out failed. You must be at the office to check out (${Math.round(calculatedDistance)} meters away).` 
            });
        }

        // --- Rest of your localized check-out save execution block ---
        const now = new Date();
        const options = { timeZone: "Asia/Dhaka", hour12: false };
        const datePart = now.toLocaleDateString("en-CA", options);
        const timePart = now.toLocaleTimeString("en-US", options);

        const record = await Attendance.findOne({ where: { employee_id, date: datePart } });
        if (!record) return res.status(404).json({ message: "No check-in record found for today" });
        if (record.check_out) return res.status(400).json({ message: "Already checked out today" });

        record.check_out = timePart;
        await record.save();

        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
