const express = require("express");
const router = express.Router();

const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/users.controller");

// GET all users
router.get("/", getUsers);

// CREATE user
router.post("/create", createUser);

// UPDATE user
router.put("/update/:id", updateUser);

// DELETE user
router.delete("/delete/:id", deleteUser);

module.exports = router;