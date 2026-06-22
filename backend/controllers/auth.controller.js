const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      type
    });

    res.json({ message: "Employee registered successfully", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return res.status(400).json({ message: "Employee not found" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 👈 CRUCIAL: Include 'role' matching employee.type in the payload
    const token = jwt.sign(
      { 
        id: employee.id, 
        email: employee.email, 
        role: employee.type // e.g., 'admin', 'hr', 'employee'
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        type: employee.type // send type to store in frontend
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };