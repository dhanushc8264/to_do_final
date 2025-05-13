import jwt from "jsonwebtoken"
import User from "../models/UserModel.js"

const protectedRoute = async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1]; // ✅ Extract token correctly
  
      if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password"); // ✅ Ensure `req.user._id` is set
  
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
  
      next();
    } catch (err) {
      res.status(401).json({ success: false, message: "Invalid token", error: err.message });
    }
  };
  
export default protectedRoute;
