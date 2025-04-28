export const maxDuration=60;
import connectDB from "@/config/connectDB";
import chatModel from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(req){
  try{
    const {userId}=getAuth(req);
    if(!userId){
      return NextResponse.json({
        success: false,
        message: "User not authenticated"
      });
    }

    const {chatId, prompt}=await req.json();

    await connectDB();
    const data=await chatModel.findOne({userId, _id: chatId});

    const userPrompt={
      role: "user",
      content: prompt,
      timestamp: Date.now()
    };

    data.messages.push(userPrompt);

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-chat",
      store: true
    });

    const message = completion.choices[0].message;
    message.timestamp=Date.now();
    data.messages.push(message);
    data.save();

    return NextResponse.json({
      success: true,
      data: message
    });
  }catch(err){
      return NextResponse.json({
        success: false,
        error: err.message
      });
    }
}