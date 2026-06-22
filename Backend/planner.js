import dotenv from 'dotenv'
dotenv.config()

import { PLANNER_SYSTEM_PROMPT } from './config/plannerConfig.js';
import {GoogleGenAI} from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function getPlan(message , history = []) {
      let retries = 3;

  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: message,
        config: {
          systemInstruction: PLANNER_SYSTEM_PROMPT,
          temperature: 0.6,
          maxOutputTokens: 16384,
        },
      });

      return response.text;
    } catch (err) {
      if (err.status === 503 && retries > 1) {
        console.log("Gemini overloaded, retrying...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        retries--;
      } else {
        throw err;
      }
    }
  }


}
