import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const DriverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "driver" },
    aadhaar: String,
    pan: String,
    drivingLicence: String,

    assignedPincodes: [String],
    assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before save
DriverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

DriverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Driver", DriverSchema);
