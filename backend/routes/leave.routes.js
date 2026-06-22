// backend/routes/leave.routes.js
const express = require("express");
const router = express.Router();
const { createLeaveRequest, getAllLeaves, reviewLeaveRequest } = require("../controllers/leave.controller");
const authorize = require("../middleware/authMiddleware");

router.get("/", authorize(["admin", "hr", "employee"]), getAllLeaves);
router.post("/apply", authorize(["admin", "hr", "employee"]), createLeaveRequest);
router.put("/review/:id", authorize(["admin"]), reviewLeaveRequest); // STRICTLY ADMIN ONLY

module.exports = router;