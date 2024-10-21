const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
require("dotenv").config();

const MODEL_URL = process.env.MODEL_URL;
let model;
const loadModel = async () => {
  try {
    model = await tf.loadGraphModel(MODEL_URL);
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error loading model:", error);
  }
};

const predict = async (imagepath) => {
  const imageBuffer = fs.readFileSync(imagepath);
  const imageTensor = tf.node.decodeImage(imageBuffer).expandDims(0);
  const prediction = await model.predict(imageTensor);
  const results = prediction.dataSync();
  return results;
};

exports.detectTumor = async (req, res) => {
  try {
    await loadModel();
    const imagepath = req.file.path;
    const predictionResults = await predict(imagepath);
    const healthyBrainLabelIndex = 0;
    const isHealthy =
      predictionResults[healthyBrainLabelIndex] > 0.5
        ? "Healthy"
        : "Not healthy";
    res.json({ status: isHealthy });
    fs.unlinkSync(imagepath);
  } catch (error) {
    console.error("Error detecting tumor:", error);
    res.status(500).json({ error: "Error detecting tumor" });
  }
};
