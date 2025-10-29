// server.js
import express, { response } from "express";
import bodyParser from "body-parser";
import { analyzeMessage } from "./utils/nlpProcessor.js";
import { queryLLM } from "./utils/llmClient.js";
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config() // Must to use credentials inside env file 
const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));

app.get('/backend/message' , (req , res)=>{
  console.log("Received Request ")
  const message  = req.params.message;
  const reply  = `Response for your requested Message (${message}) = Hi I'm Backend`
  res.send(reply);
})

app.post('/c/:id' ,(req , res , next)=>{
  const {message} = req.body;
  console.log("Received Message : " , message)
  
  res.json({"key1": `Response for your sent message : ${message+" " + Math.random(2,10 , 4)*10}`})
})
app.get('/', (req, res) => {
  res.send("Home Page");
});

// // Chat endpoint
// app.post("/chat", async (req, res) => {
//   try {
//     const { message, userProfile } = req.body;
//     if (!message) return res.status(400).json({ error: "Message is required" });

//     // Step 1: NLP preprocessing
//     const nlpData = analyzeMessage(message);

//     // Step 2: Build LLM prompt
//     const prompt = `
// You are a travel assistant chatbot.
// Your task is to help users with trip planning, travel suggestions, and bookings.
// Use the extracted data below to provide helpful, human-like replies.

// User profile: ${JSON.stringify(userProfile || {}, null, 2)}
// User message: "${nlpData.cleanedMessage}"
// Intent: ${nlpData.intent}
// Entities: ${JSON.stringify(nlpData.entities)}

// Provide a concise, useful response. Be polite, conversational, and specific.
//     `;

//     // Step 3: Query LLaMA via Ollama
//     const llmResponse = await queryLLM(prompt);

//     // Step 4: Send back structured response
//     res.json({
//       intent: nlpData.intent,
//       entities: nlpData.entities,
//       response: llmResponse.trim()
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
console.log(process.env.Port)
app.listen(process.env.port || 5000, () => console.log(`Server running at Port ${process.env.Port}`));
