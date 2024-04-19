import { 
    Box, 
    Button, 
    Tooltip ,
    Text,
    Avatar, 
    Menu,
    MenuButton,
    MenuList,
    MenuDivider,
    MenuItem,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,Input,
    useToast,
    Spinner} 
    from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import {ChevronDownIcon,BellIcon} from '@chakra-ui/icons';
import ProfileModal from './ProfileModal';
import { chatState } from '../../../context/chatProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../../userAvatar/userListItem';
export default function SideDrawer() {
  const { user,setSelectedChat ,chats,setChats} = chatState();
const [search,setSearch]=useState("");
const [searchReasult,setSearchResult]=useState([]);
const [loading,setLoading]=useState(false);
const [loadingChat,setLoadingChat]=useState();
const { isOpen, onOpen, onClose } = useDisclosure();
const btnRef = useRef();
const navigate=useNavigate();
const config={
  headers:{
    Authorization:`Bearer ${user.token}`,
    "Content-Type":"application/json"
  }
}
const logOut=()=>{
  localStorage.removeItem("userInfo");
   navigate("/");
};

const toast=useToast();

const accessChat=async (userId)=>{
  try{
    setLoadingChat(true);
    const {data}=await axios.post("/api/chat",{userId},config);
    console.log(data);
if(chats.find((c)=>c._id===data._id)){
  setChats([data,...chats]);
}
    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
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

const handleSearch=async ()=>{
if(!search){
  toast({
    title: 'Empty Search Not Possible',
    status: 'warning',
    duration: 5000,
    isClosable: true,
    position:"top-right"
  })
  return;
}

try {
  setLoading(true);

  const {data}=await axios.get(`/api/user?search=${search}`,config);
  setLoading(false);
setSearchResult(data);
console.log(data);

} catch (error) {
  toast({
    title: 'Error Occured',
    status: 'warning',
    duration: 5000,
    isClosable: true,
    position:"top-right"
  })
}
};

  return (
    <>
    <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px"
    >
        <Tooltip label="Search Users To Chat" hasArrow placement='bottom'>
<Button variant="ghost"><i className="fas fa-search" aria-hidden="true"></i>
<Text d={{base:"none",md:"flex"}} px="4" ref={btnRef} colorScheme='teal' onClick={onOpen}>Search User</Text>
</Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work Sans">
            TJ Chit Chat
        </Text>
        <div>
        <Menu>
  <MenuButton p={1}>
<BellIcon fontSize="2xl" m={1}></BellIcon>
  </MenuButton>
  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    <Avatar size='sm' cursor='pointer' name='Dan Abrahmov' src={user.pic} />
  </MenuButton>
  <MenuList>
    <ProfileModal user={user}>
    <MenuItem>My Profile</MenuItem>
    </ProfileModal>
    <MenuDivider></MenuDivider>
    <MenuItem onClick={logOut}>Logout</MenuItem>
  </MenuList>
</Menu>
</div>
    </Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
            <Input placeholder='Search by Name or Email' 
            value={search}
            onKeyDown={(e)=>{if(e.key=='Enter'){handleSearch()}}}
            mr={2}
            onChange={(e)=>{setSearch(e.target.value)}
           }
            />
            <Button onClick={handleSearch} isLoading={loading}>
              Go
            </Button>
            </Box>
            {loading ?(
<ChatLoading/>
):(
  searchReasult?.map(user=>(
    <UserListItem
    key={user._id}
    user={user}
    handleFunction={()=>{accessChat(user._id)}}
    />
  ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex"/>}
          </DrawerBody>

          <DrawerFooter>
   
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    
    </>
  )
}
