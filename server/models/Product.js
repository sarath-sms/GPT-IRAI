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
    category: { type: String, required: true },
    subCategory: String,
    description: { type: String, default: "" },
    image: String,
    available: { type: Boolean, default: true },

    // 💡 Two pricing systems
    priceOptions: [PriceOptionSchema],
    price: Number,
    netWeight: String,
    cutTypes: [CutTypeSchema],

    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: false },
    pincode: { type: String },
  },
  { timestamps: true }
);

// ⭐⭐⭐ ADD INDEX HERE — MUST be before model export ⭐⭐⭐
ProductSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 5, description: 1 } } // optional: improve relevance ranking
);

export default mongoose.model("Product", ProductSchema);
