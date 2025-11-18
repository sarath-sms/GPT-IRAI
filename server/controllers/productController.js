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
// GET /api/superadmin/products?search=
export const getProducts = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const category = req.query.category?.trim()?.toLowerCase() || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    let pipeline = [];

    // 1️⃣ TEXT SEARCH MUST BE FIRST
    if (search) {
      pipeline.push({
        $match: { $text: { $search: search } }
      });

      pipeline.push({
        $addFields: { score: { $meta: "textScore" } }
      });

      pipeline.push({ $sort: { score: -1 } });
    }

    // 2️⃣ Category filter AFTER text search
    if (category) {
      pipeline.push({
        $match: { category }
      });
    }

    // 3️⃣ Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    let products = [];

    // Run aggregation if text search used
    if (search) {
      products = await Product.aggregate(pipeline);
    } else {
      // No search → normal find
      products = await Product.find(category ? { category } : {})
        .skip(skip)
        .limit(limit);
    }

    // 4️⃣ FALLBACK → if text search returns 0 results → use REGEX
    if (search && products.length === 0) {
      products = await Product.find({
        ...(category && { category }),
        name: { $regex: search, $options: "i" }
      })
        .skip(skip)
        .limit(limit);
    }

    res.json({
      msg: "Products fetched",
      count: products.length,
      page,
      products
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
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
