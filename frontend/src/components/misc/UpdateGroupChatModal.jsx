import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  FormLabel,
  Spinner,
  Box,
  IconButton
} from '@chakra-ui/react';

import { ViewIcon } from '@chakra-ui/icons';
import { chatState } from '../../context/chatProvider';
import UserBadgeItem from '../userItem/UserBadgeItem';
import UserListItem from '../userItem/UserListItem';
import axios from 'axios';
export default function UpdateGroupChatModal({fetchAgain,setFetchAgain,fetchMessages,children}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {selectedChat,setSelectedChat,user}=chatState();
  const [groupChatName,setGroupChatName]=useState(selectedChat.chatName);
  const [selectedUsers,setSelectedUsers]=useState([]);
  const [search,setSearch]=useState("");
  const [searchResults,setSearchResults]=useState([]);
  const [loading,setLoading]=useState(false);
  const [renameLoading,setRenameLoading]=useState(false);
  const toast=useToast();
  
  const config={
    headers:{
      Authorization:`Bearer ${user.token}`,
      "Content-Type":"application/json"
    }
  }
  const handleSearch=async (query)=>{
    setSearch(query);
    if(!query.trim()){
      console.log("empty");
    setSearchResults([]);
    toast({
      title:"Enter a valid group name",
      status:"warning",
      duration:2000,
      isClosable:true,
      position:"top-right"
    });
    return;
    }
    else{
      try{
    setLoading(true);
    const {data}=await axios(`/api/user?search=${query}`,config);
    setSearchResults(data);
    setLoading(false);
      }
      catch(error){
        toast({
          title:"Something Went Wrong",
          description:error.response.data.message,
          status:"warning",
          duration:2000,
          isClosable:true,
          position:"top-right"
        });
      }
    }
  }

const handleRemove=async (removeUser)=>{
  if(!selectedChat.users.find((u)=>u._id===removeUser._id)){
    toast({
      title:"User Not In THe Group",
      status:"warning",
      duration:2000,
      isClosable:true,
      position:"top-right"
    });
    return;
  }
  if(selectedChat.groupAdmin._id !==user._id){
    console.log(selectedChat.groupAdmin);
    toast({
      title:"Only Admins Can Remove Someone",
      status:"warning",
      duration:2000,
      isClosable:true,
      position:"top-right"
    });
    return;

  }
  else{
    try{
      // if(window.confirm("Are you sure you want to remove")){
      setLoading(true);
      const {data}=await axios.put('/api/chat/groupremove',{
        chatId:selectedChat._id,
        userId:removeUser._id
      },config);
      setSelectedChat(data);
      removeUser._id===user._id?setSelectedChat():setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    // }
    }
    catch(error){
      console.log(error);
      toast({
        title:"Something Went Wrong",
        description:error.response.data.message,
        status:"warning",
        duration:2000,
        isClosable:true,
        position:"top-right"
      });
      setLoading(false);
    }
  }
}

const handleAddUser=async (addUser)=>{
    if(selectedChat.users.find((u)=>u._id===addUser._id)){
      toast({
        title:"User Already Added",
        status:"warning",
        duration:2000,
        isClosable:true,
        position:"top-right"
      });
      return;
    }
    if(selectedChat.groupAdmin._id !==user._id){
      console.log(selectedChat.groupAdmin);
      toast({
        title:"Only Admins Can Add Someone",
        status:"warning",
        duration:2000,
        isClosable:true,
        position:"top-right"
      });
      return;
    }
    else{
      try{
        setLoading(true);
        const {data}=await axios.put('/api/chat/groupadd',{
          chatId:selectedChat._id,
          userId:addUser._id
        },config);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      }
      catch(error){
        console.log(error);
        toast({
          title:"Something Went Wrong",
          description:error.response.data.message,
          status:"warning",
          duration:2000,
          isClosable:true,
          position:"top-right"
        });
        setLoading(false);
      }
    }
}

const handleRename=async (group)=>{
if(!groupChatName){
return;
}
else{
  try{
    setRenameLoading(true);
  const {data}=await axios.put("/api/chat/rename",{
    chatId:selectedChat._id,
    chatName:groupChatName
  },config);
setSelectedChat(data);
setFetchAgain(!fetchAgain);
  setRenameLoading(false);
  }
  catch(error){
    toast({
      title:"Something Went Wrong",
      status:"warning",
      duration:2000,
      isClosable:true,
      position:"top-right"
    });
    setRenameLoading(false);
  }
}
}
  return (
   <>
   {
        children?<span onClick={onOpen}>{children}</span>:(
            <IconButton
            d={{base:"flex"}}
            icon={<ViewIcon/>}
            onClick={onOpen} />
        )}
<Modal isOpen={isOpen} onClose={onClose}  isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader textAlign="center" fontFamily="Work Sans" fontSize="2em">{selectedChat?.chatName.toUpperCase()}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
<Box w="100%" display="flex" flexWrap="wrap" >
  {selectedChat.users.map((gUser)=>{if(user._id!=gUser._id){return <UserBadgeItem key={gUser._id} user={gUser} handleFunction={()=>handleRemove(gUser)}/>}})}
</Box>
<FormControl
display="flex"
>
              <Input 
              placeholder='New Chat name' 
              mb={3} 
              onChange={(e)=>{setGroupChatName(e.target.value)}} 
              value={groupChatName}
              />
            <Button
            variant="solid"
            colorScheme="teal"
            ml={1}
            isLoading={renameLoading}
            onClick={handleRename}
            >Update</Button>
                        </FormControl>
                        <FormControl mt={4}>
              <FormLabel>Search Users</FormLabel>
              <Input placeholder='Add User eg:Ram,Guest,Tirthesh'
              mb={1}
              onChange={(e)=>{handleSearch(e.target.value)}}
              />
            </FormControl>
            <Box display="flex" flexDir="column" justifyContent="center" alignItems="center">
            {loading?(<Spinner size='xl' alignSelf="center" />):(
              searchResults?.slice(0,4).map((user)=> <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}/>)
            )}
            </Box>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme='red' mr={3} onClick={()=>{handleRemove(user)}}>
        Leave Group
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
   </>
  )
}
