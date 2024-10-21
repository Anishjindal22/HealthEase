const express = require("express");
const app = express();
const database = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const tumourDetection = require("./routes/tumorDetection");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.use(express.json());
database.connectDb();

// Serve static files
app.use("/public", express.static("public"));

// Use upload routes
app.use("/api/v1/user", userRoutes);
app.use("/api", uploadRoutes);
app.use("/api", tumourDetection);
app.listen(PORT, () => {
  console.log(`app listen on ${PORT} successfully`);
});
