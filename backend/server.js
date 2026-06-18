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

// test DB
sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/auth.routes");

app.use("/api/auth", authRoutes);

/////////////////////////////////////////
const User = require("./models/User");

sequelize.sync({ alter: true })
  .then(() => console.log("DB Synced"))
  .catch(err => console.log(err));