import { Schema, model } from "mongoose"

export const messageSchema = new Schema({
senderId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
},
 receiverId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
},
text:{
    type:String
},
image:{
    type:String
}

},{timestamps:true})

export const Message = model("Message",messageSchema);