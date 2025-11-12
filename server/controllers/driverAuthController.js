import Driver from "../models/Driver.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id, role: "driver" }, process.env.JWT_SECRET);

// Driver login
export const driverLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const driver = await Driver.findOne({ mobile });
    if (!driver) return res.status(404).json({ msg: "Driver not found" });

    const match = await driver.matchPassword(password);
    if (!match) return res.status(401).json({ msg: "Invalid credentials" });

    const token = generateToken(driver._id);
    res.status(200).json({
      msg: "Login successful",
      driver: { id: driver._id, name: driver.name, mobile: driver.mobile },
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: "Login error", error: error.message });
  }
};
