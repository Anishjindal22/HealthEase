const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
require("dotenv").config();

const MODEL_URL = process.env.MODEL_URL;
let model;

const loadModel = async () => {
  try {
    model = await tf.loadLayersModel(MODEL_URL);
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error loading model:", error);
  }
};

const predict = async (imageBuffer) => {
  // Decode the image and create a tensor
  const imageTensor = tf.node.decodeImage(imageBuffer).expandDims(0);

  // Resize the image tensor to [224, 224]
  const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);

  // Perform prediction
  const prediction = await model.predict(resizedImageTensor);
  const results = prediction.dataSync();

  return results;
};

// Load the model on startup
loadModel();

exports.detectTumor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageBuffer = req.file.buffer; // Use the image buffer directly
    const predictionResults = await predict(imageBuffer);
    const healthyBrainLabelIndex = 0;
    const isHealthy =
      predictionResults[healthyBrainLabelIndex] > 0.5
        ? "Healthy"
        : "Not healthy";

    res.json({ status: isHealthy });

    // Safely delete the file (not needed here since we're using buffer)
  } catch (error) {
    console.error("Error detecting tumor:", error);
    res.status(500).json({ error: "Error detecting tumor" });
  }
};
