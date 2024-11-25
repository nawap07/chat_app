import express from "express"
import { protectRoutes } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersSideBar, sendMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoutes, getUsersSideBar);
router.get("/:id", protectRoutes, getMessages);

router.post("/send/:id", protectRoutes, sendMessages)

export default router;