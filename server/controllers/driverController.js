import User from "../models/User.js";
import Shop from "../models/Shop.js";

/** 🆕 Create Driver + Link Shops */
export const createDriver = async (req, res) => {
  try {
    const { name, mobile, password, drivingLicence, aadhaar, pan, assignedShops = [] } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ msg: "Name, Mobile & Password required" });
    }

    // create driver
    const driver = await User.create({
      name,
      mobile,
      password,
      assignedShops,
      role: "driver",
    });
    if(drivingLicence) driver.drivingLicence = drivingLicence
    if(aadhaar) driver.aadhaar = aadhaar
    if(pan) driver.pan = pan
    // 🔗 Link driver to shops
    if (assignedShops.length > 0) {
      await Shop.updateMany(
        { _id: { $in: assignedShops } },
        { $addToSet: { drivers: driver._id } }
      );
    }

    res.status(201).json({ msg: "Driver created & linked", driver });
  } catch (err) {
    console.error("❌ createDriver error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


/** 🔁 Update Driver + Sync Shops */
export const updateDriver = async (req, res) => {
  try {
    const { assignedShops = [] } = req.body;
    const driverId = req.params.id;

    const driver = await User.findById(driverId);
    if (!driver) return res.status(404).json({ msg: "Driver not found" });

    const prevShops = driver.assignedShops.map(id => id.toString());
    const newShops = assignedShops.map(id => id.toString());

    // 👉 Shops to remove driver from
    const shopsToRemove = prevShops.filter(id => !newShops.includes(id));

    // 👉 Shops to add driver into
    const shopsToAdd = newShops.filter(id => !prevShops.includes(id));

    // 🔄 Update shops
    if (shopsToRemove.length > 0) {
      await Shop.updateMany(
        { _id: { $in: shopsToRemove } },
        { $pull: { drivers: driverId } }
      );
    }

    if (shopsToAdd.length > 0) {
      await Shop.updateMany(
        { _id: { $in: shopsToAdd } },
        { $addToSet: { drivers: driverId } }
      );
    }

    // 📝 Finally update driver record
    const updatedDriver = await User.findByIdAndUpdate(
      driverId,
      { ...req.body, assignedShops: newShops },
      { new: true }
    ).select("-password");

    res.json({ msg: "Driver updated & synced", driver: updatedDriver });
  } catch (err) {
    console.error("❌ updateDriver error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


/** 🗑 Delete Driver + Remove From All Shops */
export const deleteDriver = async (req, res) => {
  try {
    const driver = await User.findById(req.params.id);
    if (!driver) return res.status(404).json({ msg: "Driver not found" });

    // remove from all shops
    if (driver.assignedShops?.length > 0) {
      await Shop.updateMany(
        { _id: { $in: driver.assignedShops } },
        { $pull: { drivers: driver._id } }
      );
    }

    await driver.deleteOne();
    res.json({ msg: "Driver deleted & unlinked" });
  } catch (error) {
    console.error("❌ deleteDriver error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


/** 📌 List All Drivers */
export const getDrivers = async (req, res) => {
  const drivers = await User.find({ role: "driver" })
    .select("-password")
    .populate("assignedShops", "name pincode");

  res.json({ count: drivers.length, drivers });
};
