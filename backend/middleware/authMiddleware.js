// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            // 1. Get the Bearer token from headers
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const token = authHeader.split(" ")[1];

            // 2. Verify token legitimacy
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attaches id, email, and role to the request object

            // 3. Enforce Role restrictions
            if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden: You do not have permission for this module." });
            }

            next(); // Role is authorized, proceed to controller
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }
    };
};

module.exports = authorize;