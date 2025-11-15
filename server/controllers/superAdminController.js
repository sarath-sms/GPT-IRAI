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

