'use client';

import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import SideBar from "@/components/SideBar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [expand, setExpand]=useState(false);
  const [messages, setMessages]=useState([]);
  const [isLoading, setIsLoading]=useState(false);
  const {selectedChat}=useAppContext();
  const containerRef=useRef();

  useEffect(()=> {
    if(selectedChat){
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(()=> {
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages]);

  return (
    <div>
      <div className="flex h-screen">
        <SideBar expand={expand} setExpand={setExpand}/>
        <div className="flex-1 flex flex-col items-stretch justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image onClick={()=> (expand ? setExpand(false) : setExpand(true))} className="rotate-180" src={assets.menu_icon} alt=""></Image>
            <Image className="opacity-70" src={assets.chat_icon} alt=""></Image>
          </div>

          {
            messages.length===0
            ? (
              <>
                <div className="flex items-center gap-3 mx-auto">
                  <Image src={assets.logo_icon} alt="" className="h-16 w-16"/>
                  <p className="text-2xl font-medium">Hi, I'm DeepSeek.</p>
                </div>
                <p className="text-sm mt-2 mx-auto mb-1">How can I help you today?</p>
              </>
            )
            : (
              <div className="mx-auto relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto" ref={containerRef}>
                <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">{selectedChat.name}</p>
                {
                  messages.map((msg, idx)=> (
                    <Message key={idx} role={msg.role} content={msg.content}/>
                  ))
                }
                {
                  isLoading && (
                    <div className="flex gap-4 max-w-3xl w-full py-3">
                      <Image className="h-9 w-9 p-1 border border-white/15 rounded-full" src={assets.logo_icon} alt="Logo"/>
                      <div className="loader flex justify-center items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                        <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                        <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                      </div>
                    </div>
                  )
                }
              </div>
            )
          }

          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading}/>

          <p className="text-xs bottom-1 text-gray-500 absolute left-1/2 transform -translate-x-1/2">AI-generated, for reference only</p>

        </div>
      </div>
    </div>
  );
}
