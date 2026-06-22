// backend/models/Setting.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Setting = sequelize.define("Setting", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  office_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8), // Exact coordinate precision tracking
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8), // Exact coordinate precision tracking
    allowNull: false,
  },
  radius: {
    type: DataTypes.INTEGER, // Stored in meters (e.g., 100)
    allowNull: false,
    defaultValue: 100,
  }
}, {
  timestamps: true,
});

module.exports = Setting;