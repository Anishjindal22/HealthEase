const express = require("express");
const app = express();
const database = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.use(express.json());
database.connectDb();

app.use("/api/v1/user", userRoutes);

// Serve static files
app.use("/public", express.static("public"));

// Use upload routes
app.use("/api", uploadRoutes);
app.listen(PORT, () => {
  console.log(`app listen on ${PORT} successfully`);
});
