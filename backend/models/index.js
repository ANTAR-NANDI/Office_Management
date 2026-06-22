const sequelize = require("../config/db");
const Employee = require("./Employee");
const Attendance = require("./Attendance");
const Leave = require("./Leave");
Employee.hasMany(Attendance, { foreignKey: "employee_id" });
Attendance.belongsTo(Employee, { foreignKey: "employee_id" });

Employee.hasMany(Leave, { foreignKey: "employee_id" });
Leave.belongsTo(Employee, { foreignKey: "employee_id" });
module.exports = {
    sequelize,
    Employee,
    Attendance,
    Leave
};