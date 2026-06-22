const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Purchase = sequelize.define("Purchase", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    employee_id: {
        type: DataTypes.STRING, // আপনার রিকোয়েস্ট অনুযায়ী সরাসরি Buyer Name Text Input
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, { timestamps: true });

module.exports = Purchase;