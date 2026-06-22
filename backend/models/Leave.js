// backend/models/Leave.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Leave = sequelize.define("Leave", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATEONLY, // Format: YYYY-MM-DD
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATEONLY, // Format: YYYY-MM-DD
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Pending", "Approved", "Declined"),
        defaultValue: "Pending",
        allowNull: false,
    },
    admin_remark: {
        type: DataTypes.TEXT,
        allowNull: true, // Only filled out when an admin acts on the request
    }
}, {
    timestamps: true,
});

module.exports = Leave;