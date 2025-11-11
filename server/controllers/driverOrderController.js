import Order from "../models/Order.js";
import Driver from "../models/Driver.js";

export const getAssignedOrders = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).populate({
      path: "assignedOrders",
      populate: { path: "user", select: "name mobile" },
    });
    res.status(200).json({ msg: "Assigned orders fetched", orders: driver.assignedOrders });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching orders", error: error.message });
  }
};

export const driverUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ msg: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ msg: "Error updating status", error: error.message });
  }
};
