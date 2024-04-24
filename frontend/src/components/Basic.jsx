import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://tj-chit-chat-5.onrender.com/'); // Replace with your server URL

const MessageReceiver = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // Listen for 'message received' event from the server

   console.log(socket.on('message received', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    }));

    return () => {
      // Clean up event listener when component unmounts
      socket.off('message received');
    };
  }, []);

  return (
    <div>
      <h1>Real-time Messages</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>Sender: {message.sender.name}</p>
            <p>Content: {message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageReceiver;
