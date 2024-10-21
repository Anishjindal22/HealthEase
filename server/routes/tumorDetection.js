const express = require("express");
const { detectTumour } = require("../controllers/TumourDetection");
const multer = require("multer");

const upload = multer({ des: "uploads/" });
const router = express.Router();

router.post("/detectTumour", upload.single("image"), detectTumour);
module.exports = router;
