const mongoose =require('mongoose');
const bcrypt=require('bcryptjs');
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
pic:{
   type:String,
   default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
}
},{timestamps:true});

userSchema.pre("save",async function(next){
    const user=this;
   if(!user.isModified) return;
   this.password=await bcrypt.hash(this.password,10);
});

userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password);
};

const user=mongoose.model("user",userSchema);



module.exports=user;
