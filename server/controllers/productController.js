import Product from "../models/Product.js";

// 🔹 Create Product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ msg: "Product created successfully", product });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Get Products (all or filtered)
export const getProducts = async (req, res) => {
  try {
    const { category, pincode } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (pincode) filter.pincode = pincode;
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Update Product
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ msg: "Product not found" });
    res.status(200).json({ msg: "Product updated", updated });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Product not found" });
    res.status(200).json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
