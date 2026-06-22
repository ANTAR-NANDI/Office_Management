// backend/routes/setting.routes.js
const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/setting.controller");
const authorize = require("../middleware/authMiddleware");

// Both Admin and HR can view settings, but ONLY Admin can rewrite them
router.get("/", authorize(["admin", "hr"]), getSettings);
router.post("/update", authorize(["admin"]), updateSettings);

module.exports = router;