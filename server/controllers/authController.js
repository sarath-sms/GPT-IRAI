import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET);

export const employeeLogin = async (req, res) => {
  try {
    const { mobile, password, role } = req.body;
    
    const user = await User.findOne({ role, mobile });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    res.json({
      msg: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
