const express = require("express");
const { detectTumor } = require("../controllers/TumourDetection");
const multer = require("multer");

const upload = multer({ des: "uploads/" });
const router = express.Router();

router.post("/detectTumour", upload.single("image"), detectTumor);
module.exports = router;
