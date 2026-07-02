// import fetch from 'node-fetch';

// async function listFreeModels() {
//   console.log("Fetching available models from OpenRouter...");
  
//   try {
//     // 1. Fetch all models from the OpenRouter API (No API key needed for this endpoint)
//     const response = await fetch('https://openrouter.ai/api/v1/models');
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     // 2. Filter the models. OpenRouter tags completely free models with ':free' in their ID, 
//     // or sets their prompt/completion pricing exactly to "0" (or 0).
//     const freeModels = data.data.filter(model => {
//       const isFreeTag = model.id.endsWith(':free');
//       const isZeroPrice = model.pricing && 
//                           Number(model.pricing.prompt) === 0 && 
//                           Number(model.pricing.completion) === 0;
                          
//       return isFreeTag || isZeroPrice;
//     });

//     console.log("====================================");
//     console.log(`🚀 Found ${freeModels.length} Free Models`);
//     console.log("====================================");

//     // 3. Print a clean, formatted list of the model IDs and Names
//     freeModels.forEach((model, index) => {
//       // Pad the index for clean alignment in the terminal
//       const num = String(index + 1).padStart(3, ' ');
//       console.log(`${num}. Model ID : \x1b[36m${model.id}\x1b[0m`); 
//       console.log(`     Name    : ${model.name}`);
//       console.log(`     Context : ${model.context_length} tokens`);
//       console.log("-".repeat(40));
//     });

//   } catch (error) {
//     console.error("Failed to fetch models:", error);
//   }
// }

// // Execute the function
// listFreeModels();
import dotenv from 'dotenv';
dotenv.config();

import { TRAVEL_AGENT_SYSTEM_PROMPT } from './config/geminiConfig.js';
import OpenAI from 'openai'; // Import the OpenAI SDK instead of GoogleGenAI

// Initialize the OpenAI client pointing to OpenRouter's URL
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, 
});

export async function mainWithHistory(message, history = []) {
  // 1. OpenRouter/OpenAI expects the System Prompt to be the very first message
  const messages = [
    { role: "system", content: TRAVEL_AGENT_SYSTEM_PROMPT }
  ];

  // 2. Format the history. 
  // NOTE: OpenRouter uses "assistant" instead of Gemini's "model", 
  // and "content" instead of Gemini's "parts: [{text}]"
  history.forEach(item => {
    messages.push({ role: "user", content: item.message });
    messages.push({ role: "assistant", content: item.response }); 
  });

  // 3. Push the new user message
  messages.push({ 
    role: "user",
    content: message 
  });
  
  // Define the model you want to use
  const selectedModel = "openrouter/free"; 
  
  // Print the model being used to the console
  
  // 4. Generate the content
  const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: messages,
      temperature: 0.6,
      max_tokens: 2048, // NOTE: Gemini's maxOutputTokens is just max_tokens here
    });
    
    console.log(` Currently Using Model: ${response.model}`);
  // 5. Return just the text string
  return response.choices[0].message.content;
}

// Export the original main function for backward compatibility
export async function main(message) {
  return mainWithHistory(message, []);
}