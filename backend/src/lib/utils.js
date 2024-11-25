import jwt from "jsonwebtoken"
export const generateToken=(res,userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET_TOKEN,{
        expiresIn:'7d'
    })
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development"
    })
    return token;
};