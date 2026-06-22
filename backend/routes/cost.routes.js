// backend/routes/cost.routes.js
const express = require("express");
const router = express.Router();
const costController = require("../controllers/cost.controller");
const authorize = require("../middleware/authMiddleware");

// 🟢 সব ইউজার (Admin, HR, Employee) খরচ দেখতে পারবে, অথবা আপনার প্রজেক্টের রিকোয়ারমেন্ট অনুযায়ী রোল চেঞ্জ করতে পারেন
router.get("/", authorize(["admin", "hr", "employee"]), costController.getCosts);

// 🟢 নতুন খরচ এন্ট্রি করার রাউট (ধরি শুধু Admin এবং HR খরচ এন্ট্রি করতে পারবে)
router.post("/add", authorize(["admin", "hr"]), costController.addCost);

module.exports = router;