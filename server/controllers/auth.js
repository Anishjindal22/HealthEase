const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      password,
      confirmPassword,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      age,
      gender,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error, please try again later" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Corrected: Use existingUser.password instead of user.password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
      firstName: existingUser.firstName, // Updated property name
      lastName: existingUser.lastName, // Updated property name
      accountType: existingUser.accounType, // Ensure correct property is referenced
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Convert existingUser to a plain object and set the token
    const userObject = existingUser.toObject();
    userObject.token = token;
    userObject.password = undefined; // Ensure password is not included in response

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user: userObject, // Send the modified user object
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error, please try again later" });
  }
};
