import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { chatState } from '../context/chatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/auth/misc/SideDrawer';
import MyChats from '../components/auth/MyChats';
import ChatBox from '../components/auth/ChatBox';
export default function ChatPage() {
  const { user } = chatState();
  useEffect(() => {
    console.log(user);
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
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}
