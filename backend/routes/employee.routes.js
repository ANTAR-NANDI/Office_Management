const express = require("express");
const router = express.Router();

const Employee = require("../models/Employee");

// CREATE
router.post("/create", async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ALL
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;