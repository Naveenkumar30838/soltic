import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message:{type:String  },
    response:{type:String }
} , {_id:false});

const chatSchema = new mongoose.Schema({
    id:{type:String , required:true},
    userId:{type:String , required:true},
    chat:[messageSchema]
},{timestamps:true})

const Chats = new mongoose.model("chat" , chatSchema)

export default Chats;