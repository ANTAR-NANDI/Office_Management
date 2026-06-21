const sequelize = require("../config/db");

const Employee = require("./Employee");
const Attendance = require("./Attendance");

module.exports = {
    sequelize,
    Employee,
    Attendance,
};