import Order from "../models/Order.js";
import Driver from "../models/Driver.js";

export const updateDriverOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const driverId = req.user._id;

    if (!["delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findOne({ _id: orderId, driver: driverId });
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status;
    await order.save();

    return res.json({ msg: `Order ${status}!` });
  } catch (err) {
    console.error("❌ updateDriverOrderStatus:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getDriverOrders = async (req, res) => {
  try {
    const driverId = req.user._id;

    const orders = await Order.find({
      driver: driverId,
      status: { $in: ["out-for-delivery", "processing"] }
    })
      .populate("user", "name mobile")
      .populate("shop", "name pincode")
      .sort({ createdAt: -1 });

    return res.json({ orders });
  } catch (err) {
    console.error("❌ getDriverOrders:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
