import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Try to extract token from headers or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 🚫 No token found
    if (!token) {
      return res.status(401).json({ msg: "Not authorized, no token" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user by ID from token
    const user = await User.findById(decoded.id).select("-password -verify");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 🧠 Attach user to request for downstream use
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT protect error:", error);
    res.status(401).json({ msg: "Not authorized, invalid or expired token" });
  }
};


export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Forbidden: Access denied" });
      }
      next();
    };
  };

//   example usage for this js file
//   router.post("/create-shop", protect, authorizeRoles("superAdmin"), next);
// router.get("/shops", protect, authorizeRoles("superAdmin", "admin"), next);