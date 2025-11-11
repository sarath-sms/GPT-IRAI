import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import driverSelfRoutes from "./routes/driverSelfRoutes.js";

dotenv.config();
const app = express();

// ✅ Global middlewares
app.use(cors());
// app.use(cors({
//     origin: ["http://localhost:5173","http://localhost:5000", "http://127.0.0.1:5173", "http://127.0.0.1:5000", "http://localhost:3000"],
//     credentials: true,
//   }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route registration
app.use("/api/superadmin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/irai", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/driver", driverSelfRoutes);


const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

  app.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`)
  );
// app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
