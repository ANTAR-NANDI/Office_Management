const express = require("express");
const router = express.Router();
const {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employee.controller");

// Matches: GET /api/employees
router.get("/", getAllEmployees);

// Matches: POST /api/employees/create
router.post("/create", createEmployee);

// Matches: PUT /api/employees/update/:id
router.put("/update/:id", updateEmployee);

// Matches: DELETE /api/employees/delete/:id
router.delete("/delete/:id", deleteEmployee);

module.exports = router;