import express  from "express";
import Chats from "../Model/chatModel.js";
import requireAuth from "../Middleware/requireAuth.js";
import {mainWithHistory} from '../apis.js'
const router = express.Router();

router.get("/chats/:username",requireAuth ,  async(req, res) => {
  try {
    const username = req.params.username;
    const result = await Chats.find({ username: req.params.username })
      .select("id updatedAt")
      .sort({updatedAt : -1});

    const formattedChats = result.map(chat => ({
      id: chat.id,
      updatedAt: chat.updatedAt.toISOString().split("T")[0]   // only the date part
    }));

      res.json({ status: "success", chats: formattedChats });
  } catch (err) {
    console.log("Chat api error ")
    res.status(500).json({ status: "error" });
  }
});


router.post('/c/:id', async (req, res) => {
  // the frontend has already check that the user is logged in or not , if req comes to this route it means the user is logged in for sure .
  const { message } = req.body;
  const chatId = req.params.id;
  
  try {
    const username =req.session.username;
    let chats = await Chats.findOne({id:chatId , username})
    if(!chats){
      chats = await Chats.create({
        id:chatId,
        username,
        chat:[]
      })
    }
    // Get or create chat history for this conversation    
    const history = chats.chat;
    // Get response with conversation history
    const response = await mainWithHistory(message, history);
    // Add user message and AI response to history
    history.push({
      message:message,
      response:response
    });
    
    // Update the stored history
    chats.chat=history;
    await chats.save();// Saving the chats array back to mongodb
    setTimeout(() => {
      res.json({ message: message, response: response });
    }, 3000);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      message: message, 
      response: "Error: Failed to generate response" 
    });
  }
});
router.get("/c/:id", async (req, res) => {
  // To get History of that chat (without message)
  try {
    const chatId = req.params.id;
    const username = req.session.username;
    const chat = await Chats.findOne({ id: chatId, username });

    if (!chat) {
      return res.json({
        status: "chat_not_found",
        message: "Invalid chat ID requested"
      });
    }

    return res.json({
      status: "success",
      chat: chat.chat     // frontend expects array of {message,response}
    });

  } catch (err) {
    console.error("Get chat error:", err);
    return res.status(500).json({
      status: "server_error",
      message: "Failed to load chat"
    });
  }
});


router.post("/chat/create",requireAuth, async (req, res) => {
  // to create a new chatId and return it
  try {
    const username = req.session.username;
    const chatId = `chat_${Date.now()}`;
    // No need to create a new chat document in MongoDB here, as it will be created when the user sends the first message. The chat history will be initialized at that time.
    // creating Here wastes the storage space in MongoDB for chats that are never used. So we will create the chat document only when the user sends the first message.
    // await Chats.create({
    //   id: chatId,
    //   username,
    //   chat: []
    // });
    return res.json({
      status: "chat_created",
      chatId
    });

  } catch (err) {
    return res.json({
      status: "server_error",
      message: "Failed to create chat"
    });
  }
});


// Optional: Clear chat history endpoint
router.delete('/c/:id',requireAuth , async (req, res) => {
  const chatId = req.params.id;
  const username = req.session.username;
  const dltRes = await Chats.deleteOne({id:chatId , username});
  res.json({ success: true, message: "Chat history cleared" });
});

export default router;


