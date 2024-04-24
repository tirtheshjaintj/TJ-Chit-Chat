import React, { useEffect } from 'react';
import { chatState } from '../context/chatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from "./SingleChat";
export default function ChatBox({fetchAgain,setFetchAgain}) {
const {selectedChat}=chatState();

return (
<>
<Box
display={{base:selectedChat?"flex":"none",md:"flex"}}
alignItems="center"
flexDir="column"
p={3}
bg="white"
w={{base:"100%",md:"68%"}}
>
<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>

</Box>
</>
  )
}
