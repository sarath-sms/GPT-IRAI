import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AddressSchema = new mongoose.Schema(
  { homeId: String, addr1: String, addr2: String },
  { _id: false }
);

const VerifySchema = new mongoose.Schema(
  {
    code: String,
    expiryTime: Date,
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: String,
    mobile: { type: String, required: true, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["superAdmin", "admin", "driver", "user"],
      default: "user",
    },
    pincode: String,
    verify: VerifySchema,
    address: AddressSchema,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

// 🔐 Encrypt password before save (only if modified)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Password verification method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
