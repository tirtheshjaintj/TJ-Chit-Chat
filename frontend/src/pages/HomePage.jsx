import React, { useEffect } from 'react'
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import '../App.css';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate=useNavigate();
  useEffect(()=>{
      const user=JSON.parse(localStorage.getItem("userInfo"));
      if(user){
          navigate("/chats");
      }
  },[navigate]);
  return (
    <>
            <div className="container">
      <Container maxW='xl' centerContent >
        <Box d='flex'
          justifyContent='center'
          bg='white'
          w='100%'
          borderRadius="2xl"
          m="20px 0px 15px 0"
          borderWidth="5px"
          textAlign="center"
          id="box"
        >
        <Text fontSize="4xl" fontFamily="Work Sans" color="black" >
          TJ-Chit-Chat
          </Text>
        </Box>
        <Box bg="white" w="100%" p={3} borderRadius='lg' color="black" borderWidth="5px">
        <Tabs variant='soft-rounded' colorScheme='green'>
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
<Login/>

    </TabPanel>
    <TabPanel>
<Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
        </Box>
      </Container>
      </div>
    </>
  )
}
