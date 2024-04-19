const express=require('express');
const chats=require('./data/data');
const app=express();
const cors=require('cors');
const db=require('./config/db');
const authRoute=require('./routes/userRoutes');
const chatRoute=require('./routes/chatRoutes');
const protect=require('./middlewares/authMid');

const {notFound,errorHandler}=require('./middlewares/notFound');

require('dotenv').config();
const port=process.env.port || 5000;
db();
// app.use(cors());
app.use(express.json());
app.use(notFound);
app.use(errorHandler);

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use("/api/chat",protect,chatRoute);
app.use('/api/user',authRoute);




app.listen(port,console.log(`Server Started at http://localhost:${port}`));