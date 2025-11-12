import Driver from "../models/Driver.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id, role: "driver" }, process.env.JWT_SECRET);

// 🔹 Create Driver
export const createDriver = async (req, res) => {
  try {
    const { name, mobile, password, aadhaar, pan, drivingLicence, assignedPincodes } = req.body;

    const exists = await Driver.findOne({ mobile });
    if (exists) return res.status(400).json({ msg: "Driver already exists" });

    const driver = await Driver.create({
      name,
      mobile,
      password,
      aadhaar,
      pan,
      drivingLicence,
      assignedPincodes,
    });

    res.status(201).json({ msg: "Driver created successfully", driver });
  } catch (error) {
    res.status(500).json({ msg: "Error creating driver", error: error.message });
  }
};

// 🔹 Get all drivers
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.status(200).json({ msg: "Drivers fetched", count: drivers.length, drivers });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching drivers", error: error.message });
  }
};

// 🔹 Update driver details
export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ msg: "Driver not found" });
    res.status(200).json({ msg: "Driver updated", driver });
  } catch (error) {
    res.status(500).json({ msg: "Error updating driver", error: error.message });
  }
};

// 🔹 Delete driver
export const deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Driver deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting driver", error: error.message });
  }
};

// 🔹 Assign orders to driver
export const assignOrderToDriver = async (req, res) => {
  try {
    const { driverId, orderIds } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ msg: "Driver not found" });

    driver.assignedOrders.push(...orderIds);
    await driver.save();

    res.status(200).json({ msg: "Orders assigned successfully", driver });
  } catch (error) {
    res.status(500).json({ msg: "Error assigning orders", error: error.message });
  }
};
