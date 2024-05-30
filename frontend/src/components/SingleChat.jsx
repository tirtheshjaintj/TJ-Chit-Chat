import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Text,
  Avatar,
  Spinner,
  Input,
  FormControl,
  useToast
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender } from '../config/chatLogic';
import ProfileModal from './misc/ProfileModal';
import UpdateGroupChatModal from './misc/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import { chatState } from '../context/chatProvider';
import io from 'socket.io-client';

let socket,selectedChatCompare;

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat ,notification,setNotification} = chatState();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);

  const toast = useToast();
  const goBack = () => {
    setSelectedChat(null);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    }
  };

  const fetchMessages=async ()=>{
    if(!selectedChat) return;
    try {
      setLoading(true);
      const {data}=await axios.get(`/api/message/${selectedChat._id}`,config);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Something Went Wrong',
        description: error.response.data.message,
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }

  useEffect(()=>{
    socket=io();
    socket.on("connected",()=>setSocketConnected(true));
    socket.emit("setup",user);
    },[]);
    
  useEffect(()=>{
    if (!socket) return;
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stop typing",()=>setIsTyping(false));
    socket.on('message received', (data) => {
      if(!selectedChatCompare || selectedChatCompare._id !== data.chat._id){
           if(!notification.includes(data)){
                     setNotification([data,...notification]);
                     setFetchAgain(!fetchAgain);
                     console.log(notification);
           }
      }
      else{
      setMessages([...messages, data]);
      }
    }
  );
 
    return () => {
      socket.off('message received');
    };
  })

    useEffect(() => {
      fetchMessages();
      selectedChatCompare = selectedChat;
    }, [selectedChat]);
    
    
    


  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      socket.emit("stop typing",selectedChat._id);
      try {
        setNewMessage('');
        const { data } = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id
        }, config);
        socket.emit('new message',data);
        setMessages([...messages, data]);
        // console.log(data);
      } catch (error) {
        // console.log(error);
        toast({
          title: 'Something Went Wrong',
          description: error.response.data.message,
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: 'top-right'
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing Indicator
    if(!socketConnected){
          return;
    }
    
    if(!typing){
      setTyping(true);
      socket.emit("typing",user._id);
    }

    let lastTyping=new Date().getTime();
    let timerlength=3000;
    setTimeout(()=>{
          let timeNow=new Date().getTime();
          let timeDiff=timeNow-lastTyping;
          if(timeDiff>=timerlength){
            socket.emit("stop typing",selectedChat._id);
            setTyping(false);
          }
    },timerlength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work Sans"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
            textTransform="capitalize"
            textAlign="center"
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={goBack}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users).name}
                <ProfileModal user={getSender(user, selectedChat.users)}>
                  <Avatar
                    mr={2}
                    size="md"
                    cursor="pointer"
                    name={!selectedChat.isGroupChat ? (getSender(user, selectedChat.users).name) : (selectedChat.chatName)}
                    alt={!selectedChat.isGroupChat ? (getSender(user, selectedChat.users).name) : (selectedChat.chatName)}
                    src={!selectedChat.isGroupChat ? (getSender(user, selectedChat.users).pic) : null}
                  />
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()} 📢
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
                  <Avatar
                    mr={2}
                    size="md"
                    cursor="pointer"
                    name={!selectedChat.isGroupChat ? (getSender(user, selectedChat.users).name) : (selectedChat.chatName)}
                    alt={!selectedChat.isGroupChat ? (getSender(user, selectedChat.users).name) : (selectedChat.chatName)}
                    src={!selectedChat.isGroupChat ? (getSender(user, selectedChat.users).pic) : ''}
                  />
                </UpdateGroupChatModal>
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#E8E8E8"
            justifyContent="flex-end"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
<div className="messages">
  <ScrollableChat messages={messages}/>
</div>
)}
             <FormControl isRequired mt={3}>
              {isTyping?(
                <div style={{display:"flex"}}>
              {"Typing..."}
              </div>):(<></>)}
                <Input 
                  variant="filled"
                  bg="#E8E8E8"
                  border="1px solid black"
                  placeholder='Enter a message...'
                  onKeyDown={sendMessage}
                  onChange={typingHandler}
                  value={newMessage}
                  alignSelf="end"
                />
              </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}
