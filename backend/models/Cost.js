const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cost = sequelize.define("Cost", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false // টাকাটা যে এমপ্লয়ি নিয়েছে তার আইডি
    }
}, { timestamps: true });

module.exports = Cost;