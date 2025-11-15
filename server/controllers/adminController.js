import User from "../models/User.js";

export const createAdmin = async (req, res) => {
  try {
    const admin = await User.create({ ...req.body, role: "admin" });
    res.json({ msg: "Admin created", admin });
  } catch (e) {
    res.status(500).json({ msg: "Error creating admin" });
  }
};

export const getAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin" }).select("-password");
  res.json({ count: admins.length, admins });
};

export const updateAdmin = async (req, res) => {
  const admin = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password");
  res.json({ msg: "Updated", admin });
};

export const deleteAdmin = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};
