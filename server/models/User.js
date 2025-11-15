import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ⭐ Common fields for all users
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },

    // ⭐ Password ONLY for employees (superAdmin, admin, driver)
    password: {
      type: String,
      required: function () {
        return this.role !== "customer"; // customer -> OTP only
      },
    },

    // ⭐ Role management
    role: {
      type: String,
      enum: ["superadmin", "admin", "driver", "customer"],
      default: "customer",
    },

    // ⭐ OTP login for customers
    verify: {
      code: String,
      expiryTime: Date,
    },

    // ⭐ Customer extra details
    pincode: { type: String },
    geo: {
      lat: Number,
      long: Number,
    },
    address: {
      houseId: String,
      addr1: String,
      addr2: String,
    },

    // ⭐ Link customers to shops
    shops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],

    // ⭐ Admin fields
    adminShops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],
    aadhaar: String,
    pan: String,

    // ⭐ Driver fields
    assignedShops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],
    drivingLicence: String,
  },
  { timestamps: true }
);

// ⭐ Hash password for employees only
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.role === "customer") return next(); // customer has no password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ⭐ Password check for employees
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.role === "customer") return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
