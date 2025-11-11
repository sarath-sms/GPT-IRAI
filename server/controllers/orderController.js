import Order from "../models/Order.js";
import User from "../models/User.js";
import Shop from "../models/Shop.js";
import Product from "../models/Product.js";

// 💰 Helper: Calculate GST (5%)
const calcGst = (subtotal) => Math.round(subtotal * 0.05);

export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      products,
      address,
      deliverySlot,
      paymentId, // Razorpay or mock
    } = req.body;

    if (!userId || !products?.length || !deliverySlot) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // 🏪 Find shop by pincode
    const shop = await Shop.findOne({ pincode: user.pincode });

    // 🧾 Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.id);

      if (!product) continue; // skip invalid product

      let unitPrice = 0;

      // Category 1 style (fish - with size & cut)
      if (product.priceOptions?.length > 0) {
        const sizePrice =
          product.priceOptions.find((opt) => opt.type === item.size)?.price || 0;
        const cutFee =
          product.cutTypes.find((cut) => cut.type === item.cutType)?.price || 0;
        unitPrice = sizePrice + cutFee;
      } else {
        // Category 2 style (meat - flat price)
        unitPrice = product.price;
      }

      const totalPrice = unitPrice * (item.qty || 1);
      subtotal += totalPrice;

      orderItems.push({
        product: product._id,
        name: product.name,
        category: product.category,
        image: product.image,
        size: item.size || "Default",
        cutType: item.cutType || "Standard",
        qty: item.qty || 1,
        unitPrice,
        totalPrice,
      });
    }

    const gst = calcGst(subtotal);
    const deliveryFee = 38;
    const total = subtotal + gst + deliveryFee;

    // 🧠 Create order document
    const newOrder = await Order.create({
      user: user._id,
      shop: shop?._id || null,
      pincode: user.pincode,
      items: orderItems,
      subtotal,
      gst,
      deliveryFee,
      total,
      deliverySlot,
      address,
      paymentId,
      status: paymentId ? "paid" : "pending",
    });

    // 🔗 Add order reference to user
    await User.updateOne(
      { _id: user._id },
      { $addToSet: { orders: newOrder._id } }
    );

    // 🔗 Add to shop analytics (optional)
    if (shop) {
      await Shop.updateOne(
        { _id: shop._id },
        { $addToSet: { orders: newOrder._id } }
      );
    }

    res.status(201).json({
      msg: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ placeOrder error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
