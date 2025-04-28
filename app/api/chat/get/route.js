import connectDB from "@/config/connectDB";
import chatModel from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req){
  try{
    const {userId}=getAuth(req);
    if(!userId){
      return NextResponse.json({
        success: false,
        message: "User not authenticated"
      });
    }

    await connectDB();
    const chats=await chatModel.find({userId});

    return NextResponse.json({
      success: true,
      chats
    });
  }catch(err){
    return NextResponse.json({
      success: false,
      error: err.message
    });
  }
}