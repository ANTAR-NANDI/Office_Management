const sequelize = require("../config/db");
const Employee = require("./Employee");
const Attendance = require("./Attendance");
Employee.hasMany(Attendance, { foreignKey: "employee_id" });
Attendance.belongsTo(Employee, { foreignKey: "employee_id" });
module.exports = {
    sequelize,
    Employee,
    Attendance,
};