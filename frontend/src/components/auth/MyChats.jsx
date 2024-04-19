import React, { useEffect, useState } from 'react'
import { chatState } from '../../context/chatProvider';
import {Box, Button, Stack, TagRightIcon, Text, useToast} from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import GroupChatModal from "./misc/GroupChatModal";
import { getSender } from '../../config/chatLogic';

export default function MyChats() {
  const [loggedUser,setLoggedUser]=useState();
  const { user,setSelectedChat,selectedChat ,chats,setChats} = chatState();
  const config={
    headers:{
      Authorization:`Bearer ${user.token}`,
      "Content-Type":"application/json"
    }
  }
  const fetchChats=async ()=>{
    try{ 
       const {data}=await axios.get("/api/chat",config);
       setChats(data);
       console.log(data);
    }
    catch(error){
      console.log(error);
      toast({
        title: 'Something Went Wrong',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"top-right"
      })
    }
  }
const toast=useToast();
useEffect(()=>{
setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
fetchChats();
},[]);
  return (
<Box
display={{base:selectedChat?"none":"flex",md:"flex"}}
flexDirection="column"
alignItems="center"
p={3}
bg="white"
w={{base:"100%",md:"31%"}}
borderRadius="lg"
borderWidth="1px"
>
  <Box
  pb={3}
  px={3}
  fontSize={{base:"24px",md:"26px"}}
  fontFamily="Work Sans"
  display="flex"
  w="100%"
  justifyContent="space-between"
  alignItems="center"
  >
My Chats
<GroupChatModal>
<Button display="flex" 
fontSize={{base:"14px",md:"10px",lg:"14px"}}
rightIcon={<AddIcon/>}
>
New Group Chat
</Button>
</GroupChatModal>
  </Box>
<Box
display="flex"
flexDir="column"
p={3}
bg="#F8F8F8"
w="100%"
h="100%"
borderRadius="lg"
overflowY="hidden"
>
{chats ? (
<Stack overflowY="scroll">
{
  chats.map((chat)=>(
   <Box 
   onClick={()=>{setSelectedChat(chat)}}
   cursor="pointer"
   bg={selectedChat===chat ?"#38B2AC":"#E8E8E8"}
   color={selectedChat===chat?"white":"black"}
px={2}
py={3}
borderRadius="lg"
key={chat._id}
>
<Text>
  {!chat.isGroupChat?(getSender(loggedUser,chat.users)):(chat.chatName)}
</Text>
   </Box>
  ))
}
</Stack>
):(
  <ChatLoading/>
)

}
</Box>

</Box>
  )
}
