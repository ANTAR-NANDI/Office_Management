const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
// Fetch all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            attributes: { exclude: ["password"] } // Never send password back to frontend
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error: error.message });
    }
};

// Create a new employee
const createEmployee = async (req, res) => {
    try {
        const { name, email, phone, designation, salary, password, type } = req.body;

        // Simple validation check
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await Employee.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = await Employee.create({
            name,
            email,
            phone,
            designation,
            salary,
            password:hashedPassword,
            type
        });

        res.status(201).json({ message: "Employee created successfully", id: newEmployee.id });
    } catch (error) {
        res.status(500).json({ message: "Error creating employee", error: error.message });
    }
};

// Update an existing employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, designation, salary, password, type } = req.body;

        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Update fields if they exist in request payload
        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.phone = phone || employee.phone;
        employee.designation = designation || employee.designation;
        employee.salary = salary || employee.salary;
        employee.type = type || employee.type;
         const hashedPassword = await bcrypt.hash(password, 10);
        if (password) {
            employee.password = password ? hashedPassword : employee.password; // Trigger hook hash encapsulation
        }

        await employee.save();
        res.json({ message: "Employee updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error: error.message });
    }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        await employee.destroy();
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee", error: error.message });
    }
};

module.exports = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};