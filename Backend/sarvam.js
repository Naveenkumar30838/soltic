import { SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv'
dotenv.config()

// const client = new SarvamAIClient({ apiSubscriptionKey: `${process.env.sarvam_api_key}` });
// await client.chat.completions({
//     messages: [{
//             role: "assistant",
//             content: "content"
//         }]
// });

// Chat Completion (POST /v1/chat/completions)
const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    "api-subscription-key": `${process.env.sarvam_api_key}`,
    "Content-Type": "application/json"
  },
   body: JSON.stringify({
    "messages": [
      {
        "content": "Hi",
        "role": "user"
      }
    ],
    "model": "sarvam-m"
  }),
});
const body = await response.json();
console.log(body.choices[0].message);
