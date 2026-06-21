const { Employee, Attendance } = require("../models");

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const totalEmployees = await Employee.count();

        const presentCount = await Attendance.count({
            distinct: true,
            col: "employee_id",
            where: {
                date: today,
                status: "Present",
            },
        });

        const lateCount = await Attendance.count({
            distinct: true,
            col: "employee_id",
            where: {
                date: today,
                status: "Late",
            },
        });

        const absentCount = Math.max(
            0,
            totalEmployees - presentCount - lateCount
        );

        res.json({
            totalEmployees,
            presentCount,
            lateCount,
            absentCount,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Dashboard error",
            error: error.message,
        });
    }
};

module.exports = { getDashboardStats };