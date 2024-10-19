const mongoose = require("mongoose");
require("dotenv").config();
exports.connectDb = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("error connecting to database", err));
};
