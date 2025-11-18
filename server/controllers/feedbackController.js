// controllers/feedbackController.js

import Feedback from "../models/Feedback.js";

export const submitFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, message, category } = req.body;

    if (!rating || !message) {
      return res.status(400).json({
        success: false,
        message: "Rating and message are required",
      });
    }

    const fb = await Feedback.create({
      user: userId,
      rating,
      message,
      category,
    });

    res.json({ success: true, message: "Feedback submitted", feedback: fb });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const replyFeedback = async (req, res) => {
    try {
      const fbId = req.params.id;
      const adminId = req.user.id;
      const { message } = req.body;
  
      if (!message) {
        return res.status(400).json({ success: false, message: "Reply message required" });
      }
  
      const updated = await Feedback.findByIdAndUpdate(
        fbId,
        {
          reply: {
            admin: adminId,
            message,
            repliedAt: new Date(),
          },
        },
        { new: true }
      );
  
      res.json({ success: true, message: "Reply added", feedback: updated });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  export const getMyFeedback = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const feedbacks = await Feedback.find({ user: userId })
        .populate("reply.admin", "name role")
        .sort({ createdAt: -1 });
  
      res.json({
        success: true,
        feedbacks,
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  export const getAllFeedback = async (req, res) => {
    try {
      const feedbacks = await Feedback.find()
        .populate("user", "name mobile")
        .populate("reply.admin", "name role")
        .sort({ createdAt: -1 });
  
      res.json({
        success: true,
        feedbacks,
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  