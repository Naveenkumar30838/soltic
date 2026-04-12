import dotenv from 'dotenv'
dotenv.config()

import { TRAVEL_AGENT_SYSTEM_PROMPT } from './config/geminiConfig.js';
import {GoogleGenAI} from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function mainWithHistory(message , history = []) {
    const formattedHistory = history.flatMap(item => [
        { role: "user", parts: [{ text: item.message }] },
        { role: "model", parts: [{ text: item.response }] }
    ]);

  
  formattedHistory.push({   
    role: "user",
    parts: [{ text: message }],
  });
    const avlModels = await ai.models.list();
    // console.log("Available Models : " , avlModels)
    const response = await ai.models.generateContent({
    // model: "gemini-3-flash-preview",
    // model: "gemma-3-4b-it",
    model: "gemini-flash-latest", // works the best till now 
    contents: formattedHistory,
    config:{
    systemInstruction: TRAVEL_AGENT_SYSTEM_PROMPT,
    temperature: 0.6,
    maxOutputTokens: 512,
    }
   
  });

  return response.text;

}




// Export the original main function for backward compatibility

export async function main(message) {
    return mainWithHistory(message, []);
}