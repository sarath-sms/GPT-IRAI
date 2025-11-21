import User from "../models/User.js";
import Shop from "../models/Shop.js";
import Waitlist from "../models/Waitlist.js";
import { sendOtp } from "../utils/sendOtp.js";
import jwt from "jsonwebtoken";

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

const createSecretToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

// 🔹 POST /api/irai/entry — Register or Login with OTP
export const checkMobNo = async (req, res) => {
  try {
    const { name, mobile, pincode } = req.body;

    if (!name || !mobile || !pincode)
      return res.status(400).json({ msg: "Missing required fields" });

    if (!/^\d{10}$/.test(mobile))
      return res.status(400).json({ msg: "Invalid Mobile Number" });

    // 🏪 Check shop availability
    const shop = await Shop.findOne({ pincode });

    // ❌ No Shop → Add to WAITLIST
    if (!shop) {
      await Waitlist.create({ name, mobile, pincode });
      return res.status(200).json({
        msg: "🙏 We will open soon in your area!",
        status: "waitlisted",
      });
    }

    // ⛔ If shop exists but closed
    if (!shop.isOpen)
      return res.status(403).json({
        msg: "Shop temporarily closed",
        status: "closed",
      });

    // HERE WE PROCEED WITH OTP FLOW ⬇️

    const otp = generateOtp();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ mobile });
    if (user) {
      user.verify = { code: otp, expiryTime };
      user.pincode = pincode;   // always update to latest pincode 💎
      await user.save();
    } else {
      user = await User.create({
        name,
        mobile,
        pincode,
        role: "customer",
        verify: { code: otp, expiryTime },
        shops: [shop._id],
      });
    }

    await Shop.updateOne(
      { _id: shop._id },
      { $addToSet: { customers: user._id } }
    );

    return res.status(200).json({
      msg: "OTP sent successfully!",
      status: "otp",
      data: {
        otp, // remove in production
        mobile,
        name,
        pincode,
      },
    });

  } catch (error) {
    console.error("❌ Error in checkMobNo:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const checkOtp = async (req, res) => {
    try {
      const { mobile, otp } = req.body;
      if (!mobile || !otp) return res.status(400).json({ msg: "Mobile and OTP are required" });
  
      const user = await User.findOne({ mobile });
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      const { code, expiryTime } = user.verify || {};
      if (!code) return res.status(400).json({ msg: "OTP not generated" });
      if (new Date(expiryTime) < new Date()) return res.status(401).json({ msg: "OTP expired" });
      if (String(code) !== String(otp)) return res.status(401).json({ msg: "Invalid OTP" });
  
      // ✅ clear OTP field
      user.verify = {};
      await user.save();
  
      // 🏪 refetch shop info
      const shop = await Shop.findOne({ pincode: user.pincode });
  
      // 🔐 generate JWT with full payload
      const token = createSecretToken({
        id: user._id,
        mobile: user.mobile,
        role: user.role,
      });
  
      // 🍪 send cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
  
      // ✅ final response
      return res.status(200).json({
        msg: "OTP verified successfully",
        profile: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          pincode: user.pincode,
          address: user.address,
          shop: shop ? { id: shop._id, name: shop.name } : null,
        },
        token,
      });
    } catch (error) {
      console.error("❌ Error in checkOtp:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  
  // controllers/userController.js


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -verify");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, profile: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;  // from auth middleware
    const { name, pincode, geo, address } = req.body;

    const updates = {};

    if (name) updates.name = name;
    if (pincode) updates.pincode = pincode;

    if (geo) {
      updates.geo = {
        lat: geo.lat,
        long: geo.long
      };
    }

    if (address) {
      updates.address = {
        houseId: address.houseId,
        addr1: address.addr1,
        addr2: address.addr2
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password -verify");

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAvailableShops = async (req, res) => {
  try {
    const shops = await Shop.find({}, { name: 1, pincode: 1, _id: 0 });
    return res.status(200).json({ msg: "Available service areas", shops });
  } catch (error) {
    console.error("❌ Error in getAvailableShops:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};