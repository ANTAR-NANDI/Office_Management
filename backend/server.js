const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

// Test DB Connection
sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// --- ROUTES REQUIRES ---
const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const settingRoutes = require("./routes/setting.routes");
const leaveRoutes = require("./routes/leave.routes"); // 🟢 ১. Leaves রাউট ইম্পোর্ট করা হলো [cite: 1211]

// --- ROUTE MOUNTS ---
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/costs", require("./routes/cost.routes"));
app.use("/api/purchases", require("./routes/purchase.routes"));
app.use("/api/leaves", leaveRoutes); // 🟢 ২. Leaves এন্ডপয়েন্ট মাউন্ট করা হলো [cite: 1211]

// --- DATABASE SYNC ---
// নিশ্চিত করুন models/index.js ফাইলে Leave মডেলটি ইম্পোর্ট ও অ্যাসোসিয়েট করা আছে 
const { Employee, Attendance, Setting, Leave,Cost,Purchase } = require("./models"); 

Cost.sync({ alter: true })
  .then(() => console.log("Database Migrated & Synced Successfully"))
  .catch(err => console.log("Migration Error:", err));