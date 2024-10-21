const s3 = require("../config/storage");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" }); // Temporary upload location
require("dotenv").config();
// Function to handle file upload
exports.uploadFile = (req, res) => {
  const file = req.file;
  // Ensure file exists
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const params = {
    Bucket: process.env.CLOUD_STORAGE_BUCKET_NAME, // Your bucket name
    Key: file.originalname, // File name in the bucket
    Body: fs.createReadStream(file.path), // Stream the file
    ContentType: file.mimetype, // Set content type
    ACL: "public-read", // Set permissions if needed
  };
  // Upload the file to the Vultr Object Storage
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(file);
      return res.status(500).send("Error uploading file: " + err.message);
    }
    res.status(200).send({ message: "File uploaded successfully", data });
  });
};
