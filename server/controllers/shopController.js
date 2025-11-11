import Shop from "../models/Shop.js";
import Driver from "../models/Driver.js";

// 🔹 Create Shop
export const createShop = async (req, res) => {
  try {
    const { pincode, name, description, openTime, closeTime } = req.body;

    // Check duplicate pincode
    const existing = await Shop.findOne({ pincode });
    if (existing) return res.status(400).json({ msg: "Shop with this pincode already exists" });

    const shop = await Shop.create({
      pincode,
      name,
      description,
      openTime,
      closeTime,
    });

    res.status(201).json({ msg: "Shop created successfully", shop });
  } catch (err) {
    console.error("❌ createShop error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Get All Shops
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate("admins drivers", "name mobile role");
    res.status(200).json(shops);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Get Single Shop by ID
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate("admins drivers", "name mobile role");
    if (!shop) return res.status(404).json({ msg: "Shop not found" });
    res.status(200).json(shop);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Update Shop
export const updateShop = async (req, res) => {
  try {
    const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: "Shop not found" });
    res.status(200).json({ msg: "Shop updated", updated });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Delete Shop
export const deleteShop = async (req, res) => {
  try {
    const deleted = await Shop.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Shop not found" });
    res.status(200).json({ msg: "Shop deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Toggle Open / Close
export const toggleShopStatus = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ msg: "Shop not found" });

    shop.isOpen = !shop.isOpen;
    await shop.save();

    res.status(200).json({ msg: `Shop is now ${shop.isOpen ? "Open ✅" : "Closed 🔒"}`, shop });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Link existing drivers to a shop
export const linkDriversToShop = async (req, res) => {
  try {
    const { shopId, driverIds } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ msg: "Shop not found" });

    // Link drivers to shop
    for (const driverId of driverIds) {
      const driver = await Driver.findById(driverId);
      if (driver) {
        if (!driver.assignedPincodes.includes(shop.pincode)) {
          driver.assignedPincodes.push(shop.pincode);
          await driver.save();
        }
      }
    }

    shop.drivers = [...new Set([...shop.drivers, ...driverIds])];
    await shop.save();

    res.status(200).json({ msg: "Drivers linked to shop", shop });
  } catch (error) {
    console.error("❌ linkDriversToShop error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// 🔹 Link admins to a shop
export const linkAdminsToShop = async (req, res) => {
  try {
    const { shopId, adminIds } = req.body;
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ msg: "Shop not found" });

    shop.admins = [...new Set([...shop.admins, ...adminIds])];
    await shop.save();

    res.status(200).json({ msg: "Admins linked to shop", shop });
  } catch (error) {
    console.error("❌ linkAdminsToShop error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};