const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const doctor = require("../models/doctor");

// login controller for doctors
exports.doctorlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingDoctor = await doctor.findOne({ email });
    if (!existingDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingDoctor.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const payload = {
      email: existingDoctor.email,
      id: existingDoctor._id,
      specialisation: existingDoctor.specialisation,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    return res
      .cookie("token", token, options)
      .status(200)
      .json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// sign up controller for doctors
exports.doctorsignup = async (req, res) => {
  try {
    const { name, email, password, specialisation } = req.body;
    const existingDoctor = await doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new doctor({
      name,
      email,
      password: hashedPassword,
      specialisation,
    });
    await newDoctor.save();
    return res.status(201).json({ message: "Doctor created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
