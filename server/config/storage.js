const AWS = require("aws-sdk");
require("dotenv").config();
const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.HOST_NAME),
  accessKeyId: process.env.CLOUD_STORAGE_ACCESS_KEY,
  secretAccessKey: process.env.CLOUD_STORAGE_SECRET_KEY,
  s3ForcePathStyle: true,
  region: "ap-south-1",
  signatureVersion: "v4",
});

module.exports = s3;
