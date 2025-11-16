import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";

router.use(arcjetProtection);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", protectRoute, logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check-auth", protectRoute, (req, res) => {
  res.status(200).json({
    id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    profilePic: req.user.profilePic,
  });
});

export default router;
