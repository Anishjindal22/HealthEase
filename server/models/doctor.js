const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    feesPerConsultation: {
      type: Number,
      required: true,
    },
    timings: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    role: {
      type: String,
      default: "doctor",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
