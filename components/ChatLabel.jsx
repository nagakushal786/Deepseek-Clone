import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React from 'react';
import toast from 'react-hot-toast';

const ChatLabel = ({openMenu, setOpenMenu, id, name}) => {
  const {fetchUsersChats, chats, setSelectedChat}=useAppContext();

  const selectChat=()=> {
    const chatData=chats.find(chat=> chat._id===id);
    setSelectedChat(chatData);
  }

  const renameChat=async ()=> {
    try{
      const newName=prompt("Enter new name");
      if(!newName){
        return;
      }

      const {data}=await axios.post("/api/chat/rename", {
        chatId: id,
        name: newName
      });

      if(data.success){
        fetchUsersChats();
        setOpenMenu({id: 0, open: false});
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    }catch(err){
      toast.error(err.message);
    }
  }

  const deleteChat=async ()=> {
    try{
      const confirm=window.confirm("Are you sure, you want to delete the chat?");
      if(!confirm){
        return;
      }

      const {data}=await axios.post("/api/chat/delete", {
        chatId: id
      });

      if(data.success){
        fetchUsersChats();
        setOpenMenu({id: 0, open:false});
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    }catch(err){
      toast.error(err.message);
    }
  }

  return (
    <div onClick={selectChat} className='flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer'>
      <p className='group-hover:max-w-5/6 truncate'>{name}</p>
      <div onClick={e=> {e.stopPropagation(); setOpenMenu({id: id, open: !openMenu.open})}} className='group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg'>
        <Image className={`w-4 ${openMenu.id===id && openMenu.open ? '' : 'hidden'} group-hover:block`} src={assets.three_dots} alt=''/>
        <div className={`absolute ${openMenu.id===id && openMenu.open ? 'block' : 'hidden'} -right-36 top-6 bg-gray-700 rounded-xl w-max p-2`}>
          <div onClick={renameChat} className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
            <Image className='w-4' src={assets.pencil_icon} alt=''/>
            <p>Rename</p>
          </div>
          <div onClick={deleteChat} className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
            <Image className='w-4' src={assets.delete_icon} alt=''/>
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatLabel
