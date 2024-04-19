const { validationResult } = require('express-validator');
const User=require('../models/User');
const generateToken=require('../config/generateToken');

const authUser=async (req,res)=>{
    const {email,password}=req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
   }
   const user =await User.findOne({email});
   if(user && (await user.matchPassword(password))){
    return res.json({...user._doc,token:generateToken(user._id),password:undefined});
   }else{
    return res.status(400).json({errors:[{ msg: "Wrong Login Credentials"}]});
   }
}
const registerUser=async (req,res)=>{
    const {name,email,password,pic}=req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
   }
   try{
   const email_check=email.toString().toLowerCase();
   const userExists =await User.findOne({email_check});
   if(userExists){
       return res.status(400).json({errors:[{ msg: "Sorry User Already Exists"}]});
   }
   const user=await User.create({
       name,
       email,
       password,
       pic
   });

   if(user){
       return res.status(201).json({...user._doc,token:generateToken(user._id),password:undefined});
   }
   else{
       return res.status(400).json({errors:[{  msg: "Something Went Wrong"}]});
   }
   
   }
   catch(error){
   console.log(error);
    }
}

const checkUser=async (req,res)=>{
    const {email}=req.body;
    const email_check=email.toString().toLowerCase();
   const userExists =await User.findOne({email_check});
   if(userExists){
       return res.status(400).json({errors:[{ msg: "Sorry User Already Exists"}]});
   }
   else{
    return res.status(201).json({success:"All Clear"});
   }
}

  // /api/user?search=piyush
const allUsers=async (req,res)=>{

    // $or used  to add multiple or conditions

    const keyword=req.query.search ? {
         $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
         ]
    }:{};
//$ne used to not find not equal
    const users =await User.find(keyword).select("-password -createdAt -updatedAt -__v").find({_id:{$ne:req.user._id}});
    return res.status(201).json(users); 
}




module.exports={authUser,registerUser,checkUser,allUsers};