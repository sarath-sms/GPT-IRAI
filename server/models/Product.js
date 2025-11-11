import mongoose from "mongoose";

const PriceOptionSchema = new mongoose.Schema(
  {
    type: { type: String },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { _id: false }
);

const CutTypeSchema = new mongoose.Schema(
  {
    type: { type: String },
    price: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // fish, meat, poultry
    subCategory: String,
    description: { type: String, default: "" },
    image: String,
    available: { type: Boolean, default: true },
    priceOptions: [PriceOptionSchema],
    price: Number,
    netWeight: String,
    cutTypes: [CutTypeSchema],
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    pincode: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
