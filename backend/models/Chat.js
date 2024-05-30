const mongoose=require('mongoose');
const chatSchema=new mongoose.Schema({
chatName:{
    type:String,
    trim:true,
    required:true
},
isGroupChat:{
    type:Boolean,
    default:false
},
users:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
}],
latestMessage:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"message"
},
groupAdmin:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
}
},{timestamps:true});

const Chat=mongoose.model("chat",chatSchema);

module.exports= Chat;