const mongoose=require('mongoose');
const { message } = require('prompt');

const messageSchema=new mongoose.Schema({
sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
},
content:{
    type:String,
    trim:true,
    required:true
},
chat:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"chat",
    required:true
}
},{timestamps:true});



const message=mongoose.model("message",messageSchema);

module.exports=message;
