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
} from '@chakra-ui/react';
import { chatState } from '../../context/chatProvider';
import axios from 'axios';
import UserListItem from '../userItem/UserListItem';
import UserBadgeItem from '../userItem/UserBadgeItem';
export default function groupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState("");
    const [searchResults,setSearchResults]=useState([]);
    const [loading,setLoading]=useState(false);
    const toast=useToast();
    const {user,chats,setChats}=chatState();
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`,
        "Content-Type":"application/json"
      }
    }
const handleSearch=async (query)=>{
setSearch(query);
if(!query.trim()){
setSearchResults([]);
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
      status:"warning",
      duration:2000,
      isClosable:true,
      position:"top-right"
    });
  }
}
}

const handleSubmit=async ()=>{

  if(!groupChatName || !selectedUsers){
    toast({
      title:"Please fill all required Fields",
      status:"warning",
      duration:2000,
      isClosable:true,
      position:"top-right"
    });
    return;
  }
  else{
    try{
      if(selectedUsers.length>=2){
        const {data}=await axios.post("/api/chat/group",{
          name:groupChatName,
          users:JSON.stringify(selectedUsers)
        },config);
        setChats([data,...chats]);
        onClose();
        toast({
          title:"New Group Chat Created",
          status:"success",
          duration:2000,
          isClosable:true,
          position:"top-right"
        });
      }else{
        toast({
          title:"At least two members are needed",
          status:"warning",
          duration:2000,
          isClosable:true,
          position:"top-right"
        });
        return;
      }
    }
    catch(error){
      toast({
        title:"Something Went Wrong",
        status:"warning",
        duration:2000,
        isClosable:true,
        position:"top-right"
      });
    }
  }

}
const handleDelete=(user)=>{
setSelectedUsers(selectedUsers.filter((u)=>{
   return u._id !=user._id
}));

}
const handleGroup=(user)=>{
if(selectedUsers.includes(user)){
  toast({
    title:"User Already Added",
    status:"warning",
    duration:2000,
    isClosable:true,
    position:"top-right"
  });
  return;
}
else{
  setSelectedUsers([...selectedUsers,user]);
}
}

return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="30px"
          fontFamily="Work Sans"
          display="flex"
          fontWeight="normal"
          justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
          <FormControl>
              <FormLabel>Chat name</FormLabel>
              <Input placeholder='Chat name' mb={3} onChange={(e)=>{setGroupChatName(e.target.value)}} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Search Users</FormLabel>
              <Input placeholder='Add User eg:Ram,Guest,Tirthesh'
              mb={1}
              onChange={(e)=>{handleSearch(e.target.value)}}
              />
            </FormControl>

            <Box w="100%" display="flex" flexWrap="wrap">
{selectedUsers?.map(user=><UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>)}
</Box>
            {loading?(<Spinner size='xl' />):(
              searchResults?.slice(0,4).map((user)=> <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>)
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
