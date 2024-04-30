import React, { useEffect, useState } from 'react'
import { chatState } from '../context/chatProvider';
import {Avatar, Box, Button, Stack, TagRightIcon, Text, useToast} from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/chatLogic';
import GroupChatModal from './misc/GroupModal';
import './style.css';
export default function MyChats({fetchAgain}) {
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
},[fetchAgain]);

  return (
<Box
display={{base:selectedChat?"none":"flex",md:"flex"}}
flexDirection="column"
alignItems="center"
p={3}
bg="white"  
backdropFilter="blur(10px)"
w={{base:"100%",md:"32%"}}
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
  color="black"
    >
My Chats
<GroupChatModal>
<Button display="flex" 
fontSize={{base:"14px"}}
rightIcon={<AddIcon/>}
>
<Text>New Group Chat</Text>
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
w="100%"
display="flex"
alignItems="center"
px={3}
py={2}
mb={2}
borderRadius="lg"
onClick={()=>{setSelectedChat(chat)}}
cursor="pointer"
key={chat._id}
bg={selectedChat===chat ?"#38B2AC":"#E8E8E8"}
color={selectedChat===chat?"white":"black"}
>
<Avatar
mr={2}
size="md"
cursor="pointer"
name={!chat.isGroupChat?(getSender(user,chat.users).name):(chat.chatName)}
src={!chat.isGroupChat?(getSender(user,chat.users).pic):" "}
/>
<Box>
  <Box display="flex" flexDirection="column">
<Text textTransform="capitalize" fontSize="1.2em">
  {!chat.isGroupChat?(getSender(user,chat.users).name):(chat.chatName+" 📢 ")}
</Text>
<br />
<Text textTransform="capitalize" fontSize="1em">
  {chat.latestMessage?.content} 
</Text>
</Box>
</Box>
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
