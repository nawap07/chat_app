import express from "express"
import cookieParser  from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import authRouter from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import { app ,server} from "./lib/socket.js"

dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname=path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}


server.listen(PORT, () => {
    connectDB();
    console.log(`Server is started at http://localhost:${PORT}`)
})