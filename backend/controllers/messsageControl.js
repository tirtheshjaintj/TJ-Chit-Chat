const Message=require('../models/Message');
const Chat=require('../models/Chat');
const User=require('../models/User');

const sendMessage=async (req,res)=>{
const {content,chatId}=req.body;
if(!content||!chatId){
    console.log("Invalid data passed into request");
    return res.status(400);
}
const newMessage={
sender:req.user._id,
content,
chat:chatId
};
try{
let message=(await (await Message.create(newMessage))
.populate("sender","name pic"))
.populate("chat");
message=await User.populate(message,{
    path:'chat.users',
    select:"name pic email"
});

console.log(message);

// message=await User.populate(message,{
//     path:'chat.users',
//     select:"name pic email"
// }); 

await Chat.findByIdAndUpdate(req.body.chatId,{
    latestMessage:message
})
return res.status(200).json(message);
}
catch(error){
     console.log(error);
    return res.status(400).json(error);
}
}

const allMessage=async(req,res)=>{
try{
 const messages=await Message.find({chat:req.params.chatId}).populate("sender","name pic email")
 .populate("chat")
 res.status(200).json(messages);
}
catch(error){
    console.log(error);
    return res.status(400).json(error);
}
}


module.exports={sendMessage,allMessage};