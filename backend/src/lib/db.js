import mongoose from "mongoose";

export const connectDB = async () => {
   try {
     const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);
     console.log(`Database is connect successfully ${conn.connection.host}`);
   } catch (error) {
    console.log("DB Error" , error.message);
   }
}