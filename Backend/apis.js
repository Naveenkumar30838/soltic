import dotenv from 'dotenv'
dotenv.config()
// const gemini_api_key = process.env.gemini_api_key

// import {GoogleGenAI} from "@google/genai";
// const ai = new GoogleGenAI(gemini_api_key);


// async function main(message){
//     const response = await ai.models.generateContent({
//         model:"gemini-2.5-flash",
//         contents:message,
//     })
//     return response;
// }
// export{
//     main
// }

// apis.js




// import dotenv from 'dotenv'
import { TRAVEL_AGENT_SYSTEM_PROMPT } from './config/geminiConfig.js';
// dotenv.config()

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const gemini_api_key = process.env.GEMINI_API_KEY;
// const ai = new GoogleGenerativeAI(gemini_api_key);


// export async function mainWithHistory(message, history = []) {
    
//     const formattedHistory = history.flatMap(item => [
//     { role: "user", parts: [{ text: item.message }] },
//     { role: "model", parts: [{ text: item.response }] }
//   ]);

//     try {
       
        
//         const model = ai.getGenerativeModel({ 
//             // model: "gemini-2.0-flash-exp",
//             model:"gemini-2.0-flash",
//              systemInstruction: {
//                 role: "system",
//                 parts: [{ text: TRAVEL_AGENT_SYSTEM_PROMPT }],
//             },
//         });
//         // Start a chat session with history
//         const chat = model.startChat({
//             history: formattedHistory, // Pass previous conversation
//             generationConfig: {
//                 maxOutputTokens: 1000,
//             },
//         });
//         // Send the new message
//         const result = await chat.sendMessage(message);
//         console.log("Gemini API response:", result);
//         const text  = result.response.text();
//         return text;
        
//     } catch (error) {
//         console.log("Error is : " , error)
//         console.error("Error in mainWithHistory (gemini api call) ");
//         return "Error generating response";
//     }
// }


// Using the Updated google/genai module 

import {GoogleGenAI} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function mainWithHistory(message , history = []) {
    const formattedHistory = history.flatMap(item => [
        { role: "user", parts: [{ text: item.message }] },
        { role: "model", parts: [{ text: item.response }] }
    ]);

  // ---- ADD CURRENT USER MESSAGE ----
  formattedHistory.push({
    role: "user",
    parts: [{ text: message }],
  });
    const avlModels = await ai.models.list();
    // console.log("Available Models : " , avlModels)
  
    const response = await ai.models.generateContent({
    // model: "gemini-3-flash-preview",
    // model: "gemma-3-4b-it",
    model: "gemini-flash-latest",
    systemInstruction:TRAVEL_AGENT_SYSTEM_PROMPT,
    contents: formattedHistory,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 512,
    },
  });
  return response.text;

}




// Export the original main function for backward compatibility

export async function main(message) {
    return mainWithHistory(message, []);
}