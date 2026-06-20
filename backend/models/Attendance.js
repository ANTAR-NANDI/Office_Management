const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attendance = sequelize.define("Attendance", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },

    check_in: {
        type: DataTypes.TIME,
        allowNull: true,
    },

    check_out: {
        type: DataTypes.TIME,
        allowNull: true,
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "Present",
    },
});

module.exports = Attendance;