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

    // 💡 Two pricing systems
    priceOptions: [PriceOptionSchema], // for fish-like products
    price: Number,                     // for fixed-price items
    netWeight: String,                 // for meat/poultry
    cutTypes: [CutTypeSchema],         // for fish/meat

    // 🏪 Optional linkage (future-ready)
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: false },
    pincode: { type: String }, // for search/indexing
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
