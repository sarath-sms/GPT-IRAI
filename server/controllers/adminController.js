import Order from "../models/Order.js";
import Driver from "../models/Driver.js";

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
