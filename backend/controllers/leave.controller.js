// backend/controllers/leaveController.js
const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// 1. Employees can submit a leave request
const createLeaveRequest = async (req, res) => {
    try {
        const { employee_id, start_date, end_date, reason } = req.body;

        if (!employee_id || !start_date || !end_date || !reason) {
            return res.status(400).json({ message: "All input fields are required." });
        }

        const leave = await Leave.create({
            employee_id,
            start_date,
            end_date,
            reason,
            status: "Pending"
        });

        res.status(201).json({ message: "Leave request submitted successfully!", leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Fetch records (Employees see theirs; Admin/HR see everything)
const getAllLeaves = async (req, res) => {
    try {
        const { role, id: userId } = req.user; 
        let whereCondition = {};

        // If not privileged, restrict items to the logged-in user's ID
        if (role === "employee") {
            whereCondition.employee_id = userId;
        }

        const leaves = await Leave.findAll({
            where: whereCondition,
            include: [{ model: Employee, attributes: ["name", "designation"] }],
            order: [["createdAt", "DESC"]]
        });

        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Admin operation to resolve a request
const reviewLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_remark } = req.body; // status: "Approved" or "Declined"

        if (!["Approved", "Declined"].includes(status)) {
            return res.status(400).json({ message: "Invalid status state update." });
        }

        const leave = await Leave.findByPk(id);
        if (!leave) return res.status(404).json({ message: "Leave application record not found." });

        leave.status = status;
        leave.admin_remark = admin_remark || null;
        await leave.save();

        res.json({ message: `Leave request has been ${status.toLowerCase()} successfully!`, leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createLeaveRequest, getAllLeaves, reviewLeaveRequest };