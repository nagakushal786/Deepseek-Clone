import connectDB from "@/config/connectDB";
import chatModel from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req){
  try{
    const {userId}=getAuth(req);
    if(!userId){
      return NextResponse.json({
        success: false,
        message: "User not authenticated"
      });
    }

    const {chatId, name}=await req.json();
    
    await connectDB();
    await chatModel.findOneAndUpdate({_id: chatId, userId}, {name});

    return NextResponse.json({
      success: true,
      message: "Chat Renamed"
    });
  }catch(err){
    return NextResponse.json({
      success: false,
      error: err.message
    });
  }
}