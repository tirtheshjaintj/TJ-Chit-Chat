import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import {ChatProvider} from './context/chatProvider.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <ChatProvider>
        <ChakraProvider>
    <App />
    </ChakraProvider>
  </ChatProvider>
)
