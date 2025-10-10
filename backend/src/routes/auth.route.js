import express from "express";
const router = express.Router();
import { signup } from "../controllers/auth.controller.js";

router.post("/signup", signup);

router.get("/login", (req, res) => {
  res.send("login endpoint");
});

router.get("/logout", (req, res) => {
  res.send("logout endpoint");
});

export default router;
