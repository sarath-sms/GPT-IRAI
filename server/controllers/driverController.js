import User from "../models/User.js";

export const createDriver = async (req, res) => {
  const driver = await User.create({ ...req.body, role: "driver" });
  res.json({ msg: "Driver created", driver });
};

export const getDrivers = async (req, res) => {
  const drivers = await User.find({ role: "driver" }).select("-password");
  res.json({ count: drivers.length, drivers });
};

export const updateDriver = async (req, res) => {
  const driver = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password");
  res.json({ msg: "Updated", driver });
};

export const deleteDriver = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};
