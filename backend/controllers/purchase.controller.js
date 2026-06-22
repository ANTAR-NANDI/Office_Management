const { Purchase } = require("../models");

exports.addPurchase = async (req, res) => {
    try {
        const { details, amount, buyer_name, date } = req.body;
        const newPurchase = await Purchase.create({ details, amount, buyer_name, date });
        res.status(201).json({ message: "Purchase record added successfully!", newPurchase });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({ order: [["date", "DESC"]] });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};