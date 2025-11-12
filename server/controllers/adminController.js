import Order from "../models/Order.js";
import Driver from "../models/Driver.js";
import Admin from "../models/Admin.js";

// 🔹 Admin assigns order(s) to a driver
export const assignOrdersByAdmin = async (req, res) => {
  try {
    const { driverId, orderIds } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ msg: "Driver not found" });

    // Update order records
    await Order.updateMany(
      { _id: { $in: orderIds } },
      { status: "out-for-delivery", driver: driver._id }
    );

    // Add to driver's assignedOrders
    driver.assignedOrders.push(...orderIds);
    await driver.save();

    res.status(200).json({
      msg: "Orders successfully assigned to driver",
      driver,
    });
  } catch (error) {
    console.error("❌ assignOrdersByAdmin error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


// 🔹 Create Admin
export const createAdmin = async (req, res) => {
  try {
    const { name, mobile, password, email, aadhaar, pan, drivingLicence, pincodes } = req.body;

    const existing = await Admin.findOne({ mobile });
    if (existing) return res.status(400).json({ msg: "Admin already exists" });

    const admin = await Admin.create({
      name,
      mobile,
      password,
      email,
      aadhaar,
      pan,
      drivingLicence,
      pincodes,
    });

    res.status(201).json({ msg: "Admin created successfully", admin });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Get all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Update Admin
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ msg: "Admin not found" });

    res.status(200).json({ msg: "Admin updated successfully", updated });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Admin not found" });

    res.status(200).json({ msg: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};