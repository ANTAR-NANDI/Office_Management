const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Employee = sequelize.define(
    "Employee",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        designation: DataTypes.STRING,
        salary: DataTypes.FLOAT,
    },
    {
        tableName: "employees",
        timestamps: false,
    }
);

module.exports = Employee;