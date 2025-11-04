// import dotenv from 'dotenv'
// dotenv.config()
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
import dotenv from 'dotenv'
dotenv.config()

import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini_api_key = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(gemini_api_key);

export async function mainWithHistory(message, history = []) {
    try {
        const model = ai.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp"
        });
        
        // Start a chat session with history
        const chat = model.startChat({
            history: history, // Pass previous conversation
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });
        
        // Send the new message
        const result = await chat.sendMessage(message);
        const text  = result.response.text();
        return text;
        
    } catch (error) {
        console.error("Error in mainWithHistory():", error);
        return "Error generating response";
    }
}

// Export the original main function for backward compatibility
export async function main(message) {
    return mainWithHistory(message, []);
}