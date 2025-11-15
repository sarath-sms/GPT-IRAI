import Shop from "../models/Shop.js";
import User from "../models/User.js";

export const getSuperAdminDashboard = async (req, res) => {
  try {
    const totalShops = await Shop.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalDrivers = await User.countDocuments({ role: "driver" });

    const shopList = await Shop.find({}, "name pincode isOpen");

    res.json({
      totalShops,
      totalAdmins,
      totalDrivers,
      shopList,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
