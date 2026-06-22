const { Cost, Employee } = require("../models");

exports.addCost = async (req, res) => {
    try {
        const { name, details, amount, date, employee_id } = req.body;
        const newCost = await Cost.create({ name, details, amount, date, employee_id });
        res.status(201).json({ message: "Cost record added successfully!", newCost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCosts = async (req, res) => {
    try {
        const costs = await Cost.findAll({
            include: [{ model: Employee, attributes: ["name", "designation"] }],
            order: [["date", "DESC"]]
        });
        res.json(costs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};