const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const db = require('./config/db');
const authRoute = require('./routes/userRoutes');
const chatRoute = require('./routes/chatRoutes');
const messageRoute = require('./routes/messageRoutes');
const protect = require('./middlewares/authMid');
const { notFound, errorHandler } = require('./middlewares/notFound');
const path=require('path');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  pingTimeout: 6000,
  cors: {
    origin: "*"
  }
});

const port = process.env.PORT || 8000;
db();
app.use(cors());
app.use(express.json());
app.use(notFound);
app.use(errorHandler);
app.use("/api/chat", protect, chatRoute);
app.use('/api/user', authRoute);
app.use('/api/message', messageRoute);
const __dirname1=path.resolve();
app.use(express.static(path.join(__dirname1,'/frontend/dist')));
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname1,"frontend","dist","index.html"));
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('setup', (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id); // Convert ID to string before joining room
      console.log(`${userData._id} joined room`);
      socket.emit('connected');
    }
  });
  socket.on('join chat', (room) => {
    if (room) {
      socket.join(room);
      console.log(`User joined room ${room}`);
    }
  });

  socket.on("typing",(room)=>{
    socket.in(room).emit("typing");
  })

  socket.on("stop typing",(room)=>{
    socket.in(room).emit("stop typing");
  })

  socket.on('new message', (data) => {
    if (data && data.chat && data.chat.users) {
      data.chat.users.forEach(user => {
        if (user !== data.sender._id) {
          io.to(user).emit('message received', data);
        }
      });
    } else {
      console.log("Users or chat not defined");
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});
