import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    console.log("📩 Request received:", req.body); // Debugging

    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log("❌ User already exists:", email); // Debugging
      return res.status(400).json({
        success: false,
        message: "This email is already registered!",
      });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("✅ Creating new user...");
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    console.log("🎉 User registered successfully!");

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
    });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      // 🔴 Fix: The check was incorrect
      return res.status(400).json({
        success: false,
        message: "This email is not registered!",
      });
    }

    const matchPassword = await bcrypt.compare(password, userExists.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password!",
      });
    }

    const payload = {
      email,
      name: userExists.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      token,
      message: "Login successful!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
};

export { registerUser, loginUser };
