import connectDB from "@/config/connectDB";
import chatModel from "@/models/Chat";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function POST(req){
  try{
    const {userId}=auth(req);

    if(!userId){
      return NextResponse.json({
        success: false,
        message: "User not authenticated"
      });
    }

    const chatData={
      userId,
      messages: [],
      name: "New Chat"
    };

    await connectDB();
    await chatModel.create(chatData);

    return NextResponse.json({
      success: true,
      message: "Chat Created"
    });
  }catch(err){
    return NextResponse.json({
      success: false,
      error: err.message
    });
  }
}