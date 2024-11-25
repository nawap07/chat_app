import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"
export const signUp = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!email || !password || !fullName) {
            throw new Error("All Fields are required");

        }
        if (password.length < 5) {
            return res.status(400).json({ success: false, message: "Password must be at least 5 characters.." })
        }

        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ success: false, message: "Email is already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            fullName,
            email,
            password: hashedPassword
        })


        if (user) {
            generateToken(res, user._id)
            await user.save();
            return res.status(201).json({
               _id:user._id,
               fullName:user.fullName,
               email:user.email,
               profilePic:user.profilePic
            })
        } else {
            return res.status(400).json({ success: false, message: "User is not found" })
        }

    } catch (error) {
        console.log("Signup Error", error.message);

        return res.status(500).json({ success: false, message: "Internal server error" })

    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!password || !email) {
            return res.status(400).json({ message: "All Fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        const comparedPassword = await bcrypt.compare(password, user.password);
        if (!comparedPassword) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        generateToken(res, user._id)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
    } catch (error) {
        console.log("Login Error", error.message);
        return res.status(500).json({ message: "Internal server error.." })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        res.cookie("token" , "" , {maxAge:0})
        res.status(200).json({success:true,message:"Logout Successfully"})
    } catch (error) {
        console.log("Logout error", error.message);
        res.status(500).json({success:false,message:"Internal server error.."})
    }
}

export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export  const verifyUser=async(req,res)=>{
    try {
        // const user = await User.findById(req.user).select("-password");
        // if(!user){
        //   return  res.status(400).json({message:"Not Found"})
        // }
        res.status(200).json(req.user)
    } catch (error) {
        console.log("UpdateProfile Error" , error.message);
        return  res.status(500).json({message:"Internal Server Error"})
        
    }
}