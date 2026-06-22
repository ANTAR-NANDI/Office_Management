const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const authorize = require("../middleware/authMiddleware");
const Employee = require("../models/Employee");
const {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employee.controller");
router.get("/profile/me", authorize(["admin", "hr", "employee"]), async (req, res) => {
    try {
        const user = await Employee.findByPk(req.user.id, {
            attributes: ["name", "email", "phone"] // পাসওয়ার্ড ছাড়া শুধু প্রয়োজনীয় ফিল্ড
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put("/profile/update", authorize(["admin", "hr", "employee"]), async (req, res) => {
    try {
        const userId = req.user.id; // টোকেন থেকে লগইন করা ইউজারের আইডি নেওয়া হচ্ছে [cite: 1518]
        const { name, email, phone, password } = req.body;

        const employee = await Employee.findByPk(userId);
        if (!employee) return res.status(404).json({ message: "User not found" });

        // ডেটা আপডেট
        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.phone = phone || employee.phone;

        // পাসওয়ার্ড দিলে সেটা হ্যাশ করে সেভ করা হবে
        if (password && password.trim() !== "") {
            employee.password = await bcrypt.hash(password, 10);
        }

        await employee.save();
        res.json({ message: "Profile updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/", authorize(["admin", "hr", "employee"]), getAllEmployees);

// Only Admin and HR can create or update employee profiles
router.post("/create", authorize(["admin", "hr"]), createEmployee);
router.put("/update/:id", authorize(["admin", "hr"]), updateEmployee);

// Only the Admin can permanently delete an employee record
router.delete("/delete/:id", authorize(["admin"]), deleteEmployee);

module.exports = router;