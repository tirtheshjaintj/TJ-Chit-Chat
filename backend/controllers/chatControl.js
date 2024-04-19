const { modalValues } = require('dfx/Interactions/context');
const Chat = require('../models/Chat');
const User = require('../models/User');

const accessChat = async (req, res) => {
    const { userId } = req.body;
    if (userId != req.user._id) {
        if (!userId) {
            console.log("UserId param not sent with request");
            return res.status(400);
        }
        let isChat = await Chat.find(
            {
                isGroupChat: false,
                $and: [
                    {
                        users: {
                            $elemMatch: {
                                $eq: req.user._id
                            }
                        }
                    },
                    {
                        users: {
                            $elemMatch: {
                                $eq: userId
                            }
                        }
                    }
                ]
            })
            .populate("users", "-password")
            .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: "name pic email"
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        }

        else {
            let chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            };
            try {
                const createdChat = await Chat.create(chatData);
                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
                return res.status(200).json(FullChat);
            }
            catch (error) {
                console.log(error);
                res.status(400).send("Something Went Wrong");
            }

        }
    }
    else {
        res.status(400).json({ errors: [{ msg: "You Cannot chat with yourself" }] });
    }
}

const fetchChats = async (req, res) => {
    try {
        let allChats = await Chat.find({
            users: {
                $elemMatch: {
                    $eq: req.user._id
                }
            }
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        allChats = await User.populate(allChats, {
            path: 'latestMessage.sender',
            select: "name pic email"
        });
        res.status(201).json(allChats);

    }
    catch (error) {
        console.log(error);
        res.status(400).send("Something Went Wrong");
    }
}

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill All Fields" });
    }
    let users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).send("More Than 2 users are required");
    }
    users.push(req.user._id);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id
        });
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin","-password");
            res.status(200).json(fullGroupChat);
    }
    catch (error) {
        res.status(400).send("Something Went Wrong");
        console.log(error);
    }

}

const renameGroup=async(req,res)=>{
const {chatId,chatName}=req.body;

try{
const updatedChat=await Chat.findByIdAndUpdate(chatId,{
    chatName
},
{
new:true
}) .populate("users", "-password")
.populate("groupAdmin","-password");

if(!updatedChat){
res.status(404).send("Chat Not Found");
}
else{
    res.status(201).json(updatedChat);
}
}
catch(error){
    res.status(400).send("Something Went Wrong");
    console.log(error);
}
}
//Adding User To group
const addToGroup=async (req,res)=>{
    const {chatId,userId}=req.body;
    try{
    const added=await Chat.findByIdAndUpdate(chatId,{
        $push:{
            users:userId
        }},
    {new:true})
    .populate("users", "-password")
    .populate("groupAdmin","-password");
    if(!added){
        res.status(404).send("Chat Not Found");
        }
        else{
            res.status(201).json(added);
        }
    }
    catch(error){
        console.log(error);
        res.status(400).send("Something Went Wrong");
    }
    }

    //Removing User From group
const removeFromGroup=async (req,res)=>{
    const {chatId,userId}=req.body;
    try{
    const removed=await Chat.findByIdAndUpdate(chatId,{
        $pull:{
            users:userId
        }},
    {new:true})
    .populate("users", "-password")
    .populate("groupAdmin","-password");
    if(!removed){
        res.status(404).send("Chat Not Found");
        }
        else{
            res.status(201).json(removed);
        }
    }
    catch(error){
        console.log(error);
        res.status(400).send("Something Went Wrong");
    }
    }

module.exports = { accessChat, fetchChats, createGroupChat ,renameGroup,addToGroup,removeFromGroup};