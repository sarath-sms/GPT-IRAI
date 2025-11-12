import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🔹 Helper — Token generator
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET);

// 🔹 POST /api/admin/create — Create first super admin
export const createSuperAdmin = async (req, res) => {
    console.log("✅woo")
  try {
    const { name, mobile, password } = req.body;

    // Check if super admin already exists
    const existing = await User.findOne({ role: "superAdmin" });
    if (existing) return res.status(400).json({ msg: "Super admin already exists" });

    const user = await User.create({
      name,
      mobile,
      password,
      role: "superAdmin",
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({ msg: "Super admin created", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 POST /api/admin/login — Super admin login
export const superAdminLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile, role: "superAdmin" });

    if (!user) return res.status(404).json({ msg: "Super admin not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      msg: "Login successful",
      user: { id: user._id, name: user.name, mobile: user.mobile },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
