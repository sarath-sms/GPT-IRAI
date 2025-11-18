// models/Feedback.js

import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    repliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const FeedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    rating: { type: Number, min: 1, max: 5, required: true },
    message: { type: String, required: true },
    category: {
      type: String,
      enum: ["product", "delivery", "app"],
      default: "product",
    },

    reply: ReplySchema, // admin reply

  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
