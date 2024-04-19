const notFound=(req,res,next)=>{
    // const error=new Error(`Not Found -${req.originalUrl}`);
    // res.status(404);
    next();
}

const errorHandler=(err,req,res,next)=>{
    // const statusCode=res.statusCode===200?500:req.statusCode;
    // res.status(statusCode);
    // res.json({
    //     message:err.message
    // })
    next();
}

module.exports={notFound,errorHandler};