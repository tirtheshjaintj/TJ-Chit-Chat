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
export default function groupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>groupChatModal</div>
  )
}
