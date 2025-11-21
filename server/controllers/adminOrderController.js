// ⚡ Get Orders for Admin (Filter + Pagination + Pincode)
import Order from "../models/Order.js";
import Shop from "../models/Shop.js";

export const getAdminOrders = async (req, res) => {
  try {
    const adminId = req.user._id; // from protect middleware
    const { status, pincode, page = 1, limit = 10 } = req.query;

    // 🏪 Which shops admin belongs to?
    const adminShops = await Shop.find(
      { admins: adminId },
      "_id pincode name"
    );
    if (!adminShops.length) {
      return res.status(200).json({ msg: "No assigned shops", orders: [], total: 0 });
    }

    const shopIds = adminShops.map(s => s._id.toString());
    const shopPinMap = adminShops.reduce((acc, s) => ({ ...acc, [s.pincode]: s._id }), {});

    // 🔍 Base filter
    const query = { shop: { $in: shopIds } };

    // Filter by order status (optional)
    if (status) query.status = status;

    // Filter by pincode (optional)
    if (pincode && shopPinMap[pincode]) {
      query.shop = shopPinMap[pincode];
    }

    // 📌 Pagination logic
    const skip = (page - 1) * limit;

    // 📦 Fetch orders
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name mobile")
        .populate("shop", "name pincode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    return res.status(200).json({
      msg: "Orders fetched",
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("❌ getAdminOrders error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
