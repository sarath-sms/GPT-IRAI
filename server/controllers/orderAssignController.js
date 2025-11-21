// controllers/orderAssignController.js
import User from "../models/User.js";
import Shop from "../models/Shop.js";
import Order from "../models/Order.js";

/** 🔍 Get available drivers for a shop/pincode */
export const getAvailableDrivers = async (req, res) => {
    try {
      const { pincode } = req.query;
      if (!pincode) return res.status(400).json({ msg: "Pincode required" });
      // Find shop by pincode
      const shop = await Shop.findOne({ pincode }).select("_id drivers");
      if (!shop) return res.status(404).json({ msg: "Shop not found" });
  
      // All drivers for this shop
      const drivers = await User.find({
        _id: { $in: shop.drivers },
        role: "driver"
      }).select("name mobile");
  
      // Count active orders for each driver (pending / processing / out-for-delivery)
      const result = [];
      for (const d of drivers) {
        const activeCount = await Order.countDocuments({
          driver: d._id,
          status: { $in: ["processing", "out-for-delivery"] }
        });
        result.push({ ...d._doc, activeOrders: activeCount });
      }
  
      // Only pick drivers with load < 5 orders
      const filtered = result.filter(d => d.activeOrders < 5);
  
      return res.json({ drivers: filtered });
    } catch (err) {
      console.error("❌ getAvailableDrivers:", err);
      res.status(500).json({ msg: "Server error" });
    }
  };
  

/** 📌 Assign multiple orders to a driver */
export const assignOrdersToDriver = async (req, res) => {
    try {
      const { driverId, orderIds } = req.body;
  
      if (!driverId || !orderIds?.length) {
        return res.status(400).json({ msg: "driverId & orderIds required" });
      }
  
      await Order.updateMany(
        { _id: { $in: orderIds } },
        {
          $set: {
            driver: driverId,
            status: "out-for-delivery"
          }
        }
      );
  
      return res.json({ msg: "Orders assigned to driver successfully" });
    } catch (err) {
      console.error("❌ assignOrdersToDriver:", err);
      res.status(500).json({ msg: "Server error" });
    }
  };
  
  
