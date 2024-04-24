import { CloseIcon } from '@chakra-ui/icons'
import { Avatar,Box,Text } from '@chakra-ui/react'
import React from 'react'

export default function UserBadgeItem({user,handleFunction}) {
  return (
<>
<Box
px={2}
py={1}
borderRadius="lg"
m={1}
mb={3}
variant="solid"
fontSize={14}
bg="#E8E8E8"
color="black"
fontWeight="bold"
cursor="pointer"
onClick={handleFunction}
display="flex"
alignItems="center"
justifyContent="center"
>
<Avatar
mr={2}
size="sm"
cursor="pointer"
name={user.name}
src={user.pic}
/>
<Text>
{user.name}
</Text>
<CloseIcon pl={1}/>
</Box>
</>
)
}
