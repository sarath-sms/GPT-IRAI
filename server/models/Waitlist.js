// models/Waitlist.js
import mongoose from "mongoose";

const WaitlistSchema = new mongoose.Schema(
  {
    name: { type: String },
    mobile: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Waitlist", WaitlistSchema);
