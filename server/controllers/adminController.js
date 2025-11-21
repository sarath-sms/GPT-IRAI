// controllers/adminController.js
import User from "../models/User.js";
import Shop from "../models/Shop.js";
import Order from "../models/Order.js";

// ⭐ CREATE ADMIN + link to shops
export const createAdmin = async (req, res) => {
  try {
    const { name, mobile, password, adminShops = [] } = req.body;

    // Create admin user
    const admin = await User.create({
      name,
      mobile,
      password,
      role: "admin",
      adminShops,
    });

    // ⭐ Link admin to shops (many)
    for (const shopId of adminShops) {
      await Shop.updateOne(
        { _id: shopId },
        { $addToSet: { admins: admin._id } }
      );
    }

    res.json({ msg: "Admin created & linked to shops", admin });
  } catch (err) {
    console.error("❌ createAdmin error:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { adminShops = [], ...rest } = req.body;
    const adminId = req.params.id;

    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const oldShops = admin.adminShops.map(id => id.toString());
    const newShops = adminShops;

    // ⭐ Shops to Add & Remove
    const toAdd = newShops.filter(id => !oldShops.includes(id));
    const toRemove = oldShops.filter(id => !newShops.includes(id));

    // ⭐ Update admin record
    admin.adminShops = newShops;
    Object.assign(admin, rest);
    await admin.save();

    // ⭐ ADD admin in new shops
    for (const shopId of toAdd) {
      await Shop.updateOne({ _id: shopId }, { $addToSet: { admins: adminId } });
    }

    // ⭐ REMOVE admin from removed shops
    for (const shopId of toRemove) {
      await Shop.updateOne({ _id: shopId }, { $pull: { admins: adminId } });
    }

    res.json({ msg: "Admin updated & synced with shops", admin });
  } catch (err) {
    console.error("❌ updateAdmin error:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    // Remove admin from shops where assigned
    await Shop.updateMany(
      { _id: { $in: admin.adminShops } },
      { $pull: { admins: admin._id } }
    );

    await admin.deleteOne();
    res.json({ msg: "Admin deleted & unlinked from shops" });
  } catch (err) {
    console.error("❌ deleteAdmin error:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const getAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin" })
    .select("-password")
    .populate("adminShops", "name pincode");

  res.json({ count: admins.length, admins });
};

export const getMyShops = async (req, res) => {
  try {
    const adminId = req.user._id;

    const admin = await User.findById(adminId).populate("adminShops", "name pincode isOpen");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    res.status(200).json({
      count: admin.adminShops.length,
      shops: admin.adminShops
    });
  } catch (err) {
    console.error("❌ getMyShops error:", err);
    res.status(500).json({ msg: err.message });
  }
};

