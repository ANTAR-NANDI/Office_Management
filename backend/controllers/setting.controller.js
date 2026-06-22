// backend/controllers/settingController.js
const Setting = require("../models/Setting");

// 1. Fetch current active configuration credentials
const getSettings = async (req, res) => {
    try {
        let setting = await Setting.findOne();
        
        // If no settings exist yet, return a clean default template
        if (!setting) {
            setting = {
                office_name: "Default Office",
                address: "",
                latitude: 23.8103, // Default Dhaka coordinates
                longitude: 90.4125,
                radius: 100
            };
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: "Error loading office settings", error: error.message });
    }
};

// 2. Save or update the active configuration row dynamically
const updateSettings = async (req, res) => {
    try {
        const { office_name, address, latitude, longitude, radius } = req.body;

        if (!office_name || !latitude || !longitude || !radius) {
            return res.status(400).json({ message: "Office Name, Latitude, Longitude, and Radius are required." });
        }

        let setting = await Setting.findOne();

        if (setting) {
            // Update existing entry configuration rules
            setting.office_name = office_name;
            setting.address = address;
            setting.latitude = latitude;
            setting.longitude = longitude;
            setting.radius = radius;
            await setting.save();
        } else {
            // Create a brand new configuration parameters row if empty
            setting = await Setting.create({
                office_name,
                address,
                latitude,
                longitude,
                radius
            });
        }

        res.json({ message: "Office settings saved successfully!", setting });
    } catch (error) {
        res.status(500).json({ message: "Error saving configuration updates", error: error.message });
    }
};

module.exports = { getSettings, updateSettings };