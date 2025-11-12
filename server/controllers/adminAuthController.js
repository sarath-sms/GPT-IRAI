import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET);

export const adminLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const admin = await Admin.findOne({ mobile });
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = generateToken(admin._id, "admin");

    res.status(200).json({
      msg: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        mobile: admin.mobile,
        role: admin.role,
        pincodes: admin.pincodes,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
