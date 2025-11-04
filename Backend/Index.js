import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import { mainWithHistory } from "./apis.js";
import cors from 'cors'

dotenv.config()
const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));

// Store conversation histories in memory (use database in production)
const chatHistories = new Map();

app.post('/c/:id', async (req, res) => {
  const { message } = req.body;
  const chatId = req.params.id;
  
  console.log("Message:", message);
  console.log("Chat ID:", chatId);
  
  try {
    // Get or create chat history for this conversation
    if (!chatHistories.has(chatId)) {
      chatHistories.set(chatId, []);
    }
    
    const history = chatHistories.get(chatId);
    
    // Get response with conversation history
    const response = await mainWithHistory(message+"Show a Markdown Response Aligned on the Left", history);
    
    // Add user message and AI response to history
    history.push({
      role: "user",
      parts: [{ text: message }]
    });
    history.push({
      role: "model",
      parts: [{ text: response }]
    });
    
    // Update the stored history
    chatHistories.set(chatId, history);
    
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