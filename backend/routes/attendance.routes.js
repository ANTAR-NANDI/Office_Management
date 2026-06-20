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

        const data =
            await Attendance.findAll({
                where: {
                    employee_id:
                        req.params.employee_id
                },
                order: [
                    ["date", "DESC"]
                ]
            });

        res.json(data);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
module.exports = router;
