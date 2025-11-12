import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ Import Role-Based Routes
import superAdminRoutes from "./routes/superAdminRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";

// ✅ Import Common Routes (Optional)
import productRoutes from "./routes/productRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";

// TODO: remove before production
import { swaggerDocs } from "./swagger.js";

// ✅ Environment Setup
dotenv.config();

// ✅ Initialize App
const app = express();

// ✅ Middleware Setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Base Health Check
app.get("/", (req, res) => {
  res.send("🔥 IRAITCHI API IS RUNNING SMOOTHLY 🔥");
});

// ✅ Role-based Routes
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/driver", driverRoutes);

// ✅ Shared Modules
app.use("/api/products", productRoutes);
app.use("/api/shops", shopRoutes);
// TODO: remove before production
swaggerDocs(app);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Server Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
