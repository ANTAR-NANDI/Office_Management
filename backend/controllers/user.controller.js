const db = require("../db");

// GET USERS
exports.getUsers = (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// CREATE USER
exports.createUser = (req, res) => {
    const { name, email, phone, designation, salary, password, type } = req.body;

    const sql = `
        INSERT INTO users (name, email, phone, designation, salary, password, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, phone, designation, salary, password, type],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "User created", result });
        }
    );
};

// UPDATE USER
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, phone, designation, salary, type } = req.body;

    const sql = `
        UPDATE users 
        SET name=?, email=?, phone=?, designation=?, salary=?, type=?
        WHERE id=?
    `;

    db.query(
        sql,
        [name, email, phone, designation, salary, type, id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "User updated" });
        }
    );
};

// DELETE USER
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "User deleted" });
    });
};