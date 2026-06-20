const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Employee = sequelize.define("Employee", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    designation: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    salary: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

module.exports = Employee;