import React, { createContext, useContext, useEffect, useState } from 'react'
const ChatContext=createContext();

export const ChatProvider = ({children}) => {
  const [selectedChat,setSelectedChat]=useState();
  const [chats,setChats]=useState([]);
  const [user,setUser]=useState();
  const [notification,setNotification]=useState([]);
    useEffect(()=>{
        setUser(JSON.parse(localStorage.getItem("userInfo")));
    },[]);
  return (
<ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
    {children}
</ChatContext.Provider>
)
}

export const chatState=()=>{
return useContext(ChatContext);
}

