import express from "express"
import { login, logout, signUp ,updateProfile ,verifyUser } from "../controllers/auth.controller.js";
import { protectRoutes } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp)

router.post("/login", login)

router.post("/logout", logout);

router.put("/update-profile", protectRoutes,updateProfile)
router.get("/verify",protectRoutes, verifyUser)


export default router;