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
    Text
  } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
export default function ProfileModal({user,children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
        {
        children?<span onClick={onOpen}>{children}</span>:(
            <IconButton
            d={{base:"flex"}}
            icon={<ViewIcon/>}
            onClick={onOpen} />
        )}
<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
  <ModalOverlay />
  <ModalContent height="410px">
    <ModalHeader
    fontSize="40px"
    fontFamily="Work Sans"
    display="flex"
    justifyContent="center"
    
    >{user.name}</ModalHeader>
    <ModalCloseButton />
    <ModalBody
     display="flex"
     justifyContent="center"
     alignItems="center"
     flexDirection="column"
    >
<Image
borderRadius="full"
boxSize="150px"
src={user.pic}
alt={user.name}
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
