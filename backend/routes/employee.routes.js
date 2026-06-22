const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authMiddleware");
const {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employee.controller");

router.get("/", authorize(["admin", "hr", "employee"]), getAllEmployees);

// Only Admin and HR can create or update employee profiles
router.post("/create", authorize(["admin", "hr"]), createEmployee);
router.put("/update/:id", authorize(["admin", "hr"]), updateEmployee);

// Only the Admin can permanently delete an employee record
router.delete("/delete/:id", authorize(["admin"]), deleteEmployee);

module.exports = router;