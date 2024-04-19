const jwt=require('jsonwebtoken');
const User=require('../models/User');

const protect= async(req,res,next)=>{
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    let token;
    try{
      token=req.headers.authorization.split(" ")[1];
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      if(decoded){
      req.user=await User.findById(decoded.id).select("-password");
      next();
      }
      else{
        return res.json({errors:[{msg:"Invalid Authorization Request"}]});
      }
    }
    catch(error){
        return res.json({errors:[{msg:"Invalid Authorization Request"}]});
    }
}
else{
    return res.json({errors:[{msg:"Invalid Authorization Request"}]});
}
}

module.exports=protect;