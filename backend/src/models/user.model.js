import { Schema, model } from "mongoose";
// import bcryptjs from "bcryptjs"

const userSchma = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password:{
            type:String,
            required:true,
            minlength:5,
        },
        profilePic:{
            type:String,
            default:"",
        }
    }
    ,
    { timestamps: true }
); 

// userSchma.pre("save", async(next)=>{
//     if(!this.isModified("password")) return next();
//     this.password= await bcryptjs.hash(this.password,10);
// })
export const User = model("User",userSchma)