import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const ChatContext=createContext();
export const ChatProvider = ({children}) => {
  const [selectedChat,setSelectedChat]=useState();
  const [chats,setChats]=useState([]);
    const [user,setUser]=useState();
    useEffect(()=>{
        setUser(JSON.parse(localStorage.getItem("userInfo")));
    },[]);

  return (
<ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats}}>
    {children}
</ChatContext.Provider>
)
}

export const chatState=()=>{
return useContext(ChatContext);
}

