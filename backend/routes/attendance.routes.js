const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { Op } = require("sequelize");

router.post("/checkin", async (req, res) => {

    try {

        const { employee_id } = req.body;

        const today = new Date();

        const date = today.toISOString().split("T")[0];

        const time = today.toTimeString().split(" ")[0];

        const exists = await Attendance.findOne({
            where: {
                employee_id,
                date
            }
        });

        if (exists) {
            return res.status(400).json({
                message: "Already checked in today"
            });
        }

        let status = "Present";

        if (time > "10:00:00") {
            status = "Late";
        }

        const attendance = await Attendance.create({
            employee_id,
            date,
            check_in: time,
            status
        });

        res.json(attendance);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post("/checkout", async (req, res) => {

    try {

        const { employee_id } = req.body;

        const today =
            new Date().toISOString().split("T")[0];

        const time =
            new Date().toTimeString().split(" ")[0];

        const attendance =
            await Attendance.findOne({
                where: {
                    employee_id,
                    date: today
                }
            });

        if (!attendance) {
            return res.status(404).json({
                message: "Check In First"
            });
        }

        attendance.check_out = time;

        await attendance.save();

        res.json(attendance);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
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
            order: [
                ["date", "DESC"]
            ]
        });

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
module.exports = router;
