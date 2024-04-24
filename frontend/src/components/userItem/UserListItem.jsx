import React from 'react'
import { chatState } from '../../context/chatProvider'
import { Avatar, Box ,Text} from '@chakra-ui/react';

function userListItem({user,handleFunction}) {
  return (
<>
<Box
onClick={handleFunction}
cursor="pointer"
bg="#E8E8E8"
_hover={{
    background:"#38B2AC",
    color:"white"
}}
w="100%"
display="flex"
alignItems="center"
color="black"
px={3}
py={2}
mb={2}
borderRadius="lg"
>
<Avatar
mr={2}
size="sm"
cursor="pointer"
name={user.name}
src={user.pic}
/>
<Box>
<Text wordBreak="break-all">{user.name}</Text>
<Text fontSize="xs" wordBreak="break-all">
<b>Email: </b>{user.email}
</Text>
</Box>
</Box>
</>
)
}

export default userListItem;