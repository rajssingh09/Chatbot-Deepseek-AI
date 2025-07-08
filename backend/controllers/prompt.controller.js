// import OpenAI from "openai";
// import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
// import { AzureKeyCredential } from "@azure/core-auth";
// import Prompt from "../model/prompt.model.js";

// const token = process.env.GITHUB_API_Token;
// const client = ModelClient(
//     "https://models.github.ai/inference",
//     new AzureKeyCredential(token)
// );

// export const sendPrompt=async(req,res)=>{
// const {content}=req.body;
// const userId=req.userId;

// console.log("Received prompt content:", content);
// if(!content || content.trim() === ""){
//     return res.status(400).json({error:"Prompt content is required"});
// }
// try{
// // Save the user prompt to the database
// const userPrompt=await Prompt.create({
//     userId:userId,
//     role:"user",
//    content:content,
// })

// const response = await client.path("/chat/completions").post({
//     body: {
//         messages: [
//             {role: "user", content:content}
//         ],
//         model: "deepseek/DeepSeek-R1",
//         max_tokens: 2048,
//     }
// });
 
// const aiContent= await response.body.choices[0].message.content;
// console.log("AI response content:", aiContent);
// // save assistant prompt In Database
// const  aiMessage=await Prompt.create({
//     userId:userId,
//     role:"assistant",
//     content:aiContent
// })
// console.log("AI message saved to database:", aiMessage);
// return res.status(200).json({reply:aiContent});

// }catch(error){
// console.error("Error in sendPrompt:", error);
// return res.status(500).json({error:"Something went wrong with the AI response"});
// }
// }

import Prompt from "../model/prompt.model.js";
import fetch from "node-fetch"; // if using Node.js v18+, native fetch is available
// else run: npm install node-fetch

export const sendPrompt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  console.log("Received prompt content:", content);
  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Prompt content is required" });
  }

  try {
    // Save the user prompt to the database
    const userPrompt = await Prompt.create({
      userId: userId,
      role: "user",
      content: content,
    });

    // Call OpenRouter AI API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DeepSeek_API_Key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // Optional
        "X-Title": "MyApp", // Optional
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "user",
            content: content
          }
        ]
      })
    });

    const result = await response.json();
    const aiContent = result.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No response from AI");
    }

    // console.log("AI response content:", aiContent);

    // Save AI assistant message
    const aiMessage = await Prompt.create({
      userId: userId,
      role: "assistant",
      content: aiContent,
    });

    // console.log("AI message saved to database:", aiMessage);
    return res.status(200).json({ reply: aiContent });

  } catch (error) {
    console.error("Error in sendPrompt:", error.message);
    return res.status(500).json({ error: "Something went wrong with the AI response" });
  }
};
