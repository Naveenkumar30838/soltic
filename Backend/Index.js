import express from "express";
import session from 'express-session'
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import { mainWithHistory } from "./apis.js";
import cors from 'cors'
import Chats from "./Model/chatModel.js";
import {connectMongo , conn} from "./config/db.js";
import authRoutes from './Routes/authRoutes.js'
// import {  FEW_SHOT_EXAMPLES } from "./config/geminiConfig.js";

dotenv.config()
const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));

// Data base Connection  
connectMongo()


app.use(
  session({
    secret: process.env.MONGO_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
  })
);

// Routes :
app.use("/" , authRoutes);
app.post('/c/:id', async (req, res) => {
  const { message } = req.body;
  const chatId = req.params.id;
  
  console.log("Message:", message);
  console.log("Chat ID:", chatId);
  
  try {
    let chats = await Chats.findOne({id:chatId})
    if(!chats){
      const userId ="123"
      chats = await Chats.create({
        id:chatId,
        userId,
        chat:[]
      })
    }
    // Get or create chat history for this conversation    
    const history = chats.chat;
    console.log("History is : ");
    console.log(history);
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

// Optional: Clear chat history endpoint
app.delete('/c/:id', (req, res) => {
  const chatId = req.params.id;
  chatHistories.delete(chatId);
  res.json({ success: true, message: "Chat history cleared" });
});

// Optional: Get all chat IDs
app.get('/chats', (req, res) => {
  const chatIds = Array.from(chatHistories.keys());
  res.json({ chats: chatIds });
});

app.get('/', (req, res) => {
  res.send("Home Page");
});

app.listen(process.env.PORT || 5000, () => 
  console.log(`Server running at Port ${process.env.PORT || 5000}`)
);