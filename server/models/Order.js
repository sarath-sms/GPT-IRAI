import mongoose from "mongoose";

// 🔹 Individual ordered item
const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    category: String,
    image: String,

    // For both category styles
    size: { type: String }, // e.g. "Medium"
    cutType: { type: String }, // e.g. "Slice"
    netWeight: { type: String },

    // Pricing
    qty: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true }, // actual price (after size/cut)
    totalPrice: { type: Number, required: true }, // qty * (unitPrice + cutFee)
  },
  { _id: false }
);

// 🔹 Main order schema
const OrderSchema = new mongoose.Schema(
  {
    orderId: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" }, // optional future link
    pincode: String,

    items: [OrderItemSchema],

    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true }, // 5%
    deliveryFee: { type: Number, required: true, default: 38 },
    total: { type: Number, required: true },

    deliverySlot: { type: String, required: true }, // "5PM - 6PM"

    // Payment & tracking
    paymentId: { type: String }, // from Razorpay
    status: {
      type: String,
      enum: ["pending", "processing", "out-for-delivery", "delivered", "cancelled"],
      default: "pending",
    },

    // Delivery address snapshot (at order time)
    address: {
      houseId: String,
      addr1: String,
      addr2: String,
      geo: {
        lat: Number,
        long: Number,
      },
    },

    // Tracking
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // assigned driver
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who managed it (optional)

    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
