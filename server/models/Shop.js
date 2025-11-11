import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
    {
      // 🔹 Basic Info
      pincode: { type: String, unique: true, required: true },
      name: { type: String, required: true },
      description: { type: String, default: "" },
  
      // 🔹 Operational Control
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: "06:00 AM" },
      closeTime: { type: String, default: "01:00 PM" },
  
      // 🔹 Role Relationships
      admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // many-to-many
      drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // many
      customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ added
  
      // 🔹 Orders
      orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  
      // 🔹 Timestamps
      createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  export default mongoose.model("Shop", ShopSchema);
  