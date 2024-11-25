import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
export const protectRoutes = async(req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({ success: false, message: "Unautherize token" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        if (!decoded) {
            return res.status(400).json({ success: false, message: "UnAutherize or expire token" })
        }
        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"user not found.."})
        }
        req.user=user
        // req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("Protected Midleware Error", error.message);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}