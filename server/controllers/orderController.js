import Order from "../models/Order.js";
import User from "../models/User.js";
import Shop from "../models/Shop.js";
import Product from "../models/Product.js";

// 🔹 GST helper
const calcGst = (subtotal) => Math.round(subtotal * 0.05);

// 🔹 Zero pad helper
const two = (n) => (n < 10 ? "0" + n : "" + n);

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      address,
      deliverySlot,
      paymentId,
      subtotal,
      gst,
      deliveryFee,
      total,
      pincode,
    } = req.body;

    const userId = req.user._id;

    if (!items?.length || !deliverySlot) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // ⭐ 1. Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // ⭐ 2. Update user address always (your requirement #1)
    user.address = address;
    user.geo = address.geo;
    user.pincode = pincode || user.pincode;
    await user.save();

    // ⭐ 3. Shop detection using pincode
    const shop = await Shop.findOne({ pincode: user.pincode });
    if (!shop) return res.status(404).json({ msg: "No shop found for this pincode" });

    // ⭐ 4. Generate ORDER ID → YYYYMMDDXXXX
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const dateKey = `${year}${month}${day}`; // 20250919

    // Count today's orders
    const todaysCount = await Order.countDocuments({
      createdAt: {
        $gte: new Date(`${year}-${month}-${day}T00:00:00`),
        $lt: new Date(`${year}-${month}-${day}T23:59:59`)
      },
      shop: shop._id
    });

    const orderNumber = String(todaysCount + 1).padStart(4, "0"); // 0001
    const orderId = `${dateKey}${orderNumber}`; // 202509190001

    // ⭐ 5. Create new Order Document
    const newOrder = await Order.create({
      orderId,
      user: userId,
      shop: shop._id,
      pincode: user.pincode,
      items,
      subtotal,
      gst,
      deliveryFee,
      total,
      deliverySlot,
      paymentId,
      status: paymentId ? "paid" : "pending",
      address,
    });

    // ⭐ 6. Attach order to shop structured storage
    const y = year;
    const m = month;
    const d = day;

    if (!shop.orderTree) shop.orderTree = {};

    if (!shop.orderTree[y]) shop.orderTree[y] = {};
    if (!shop.orderTree[y][m]) shop.orderTree[y][m] = {};
    if (!shop.orderTree[y][m][d]) shop.orderTree[y][m][d] = [];
    
    shop.orderTree[y][m][d].push({
      orderId,
      orderRef: newOrder._id,
      createdAt: new Date(),
    });

    await shop.save();

    // ⭐ 7. Add reference to user also
    await User.updateOne(
      { _id: userId },
      { $addToSet: { orders: newOrder._id } }
    );

    return res.status(201).json({
      msg: "Order placed successfully!",
      order: newOrder,
    });

  } catch (error) {
    console.error("❌ placeOrder error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

