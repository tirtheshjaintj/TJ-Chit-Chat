import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { chatState } from '../context/chatProvider';
import { Box } from '@chakra-ui/react';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/misc/SideDrawer';
export default function ChatPage() {
  const { user ,setUser} = chatState();
  const [fetchAgain,setFetchAgain]=useState(false);
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userInfo")));
  }, []);
  return (
    <div className="App">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
}
