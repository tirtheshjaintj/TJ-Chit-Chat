import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Image,
    Button,
    Text,
    Avatar,
    Box,
    Stack
  } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
export default function ProfileModal({user,children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
    <Stack>
        {
        children?<span onClick={onOpen}>{children}</span>:(
            <IconButton
            d={{base:"flex"}}
            icon={<ViewIcon/>}
            onClick={onOpen} />
        )}
        </Stack>
<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
    fontSize="2em"
    fontFamily="Work Sans"
    display="flex"
    justifyContent="center"
    textTransform="capitalize"
    textAlign="center"
    >{user.name}</ModalHeader>
    <ModalCloseButton />
    <ModalBody
     display="flex"
     justifyContent="center"
     alignItems="center"
     flexDirection="column"
    >
<Avatar
borderRadius="full"
boxSize="150px"
size="2xl"
name={user.name}
alt={user.name}
src={user.pic}
/>
<Text margin="10px">Email: {user.email}</Text>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={onClose}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  )
}
