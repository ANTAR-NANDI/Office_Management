// backend/routes/purchase.routes.js
const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchase.controller");
const authorize = require("../middleware/authMiddleware");

// 🟢 কেনাকাটার তালিকা দেখার রাউট
router.get("/", authorize(["admin", "hr", "employee"]), purchaseController.getPurchases);

// 🟢 নতুন কেনাকাটার এন্ট্রি দেওয়ার রাউট
router.post("/add", authorize(["admin", "hr"]), purchaseController.addPurchase);

module.exports = router;