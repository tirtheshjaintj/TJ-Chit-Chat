const mongoose = require('mongoose');
const connectDB = async () => {
    try {
       const conn=await mongoose.connect(process.env.MONGO_DB)
            .then(() => {
                console.log("MongoDB Connected");
            })
            .catch((error) => {
                console.log(error);
                process.exit();
            });
    }
    catch (error) {
        console.log(error);
        process.exit();
    }
}

module.exports=connectDB;

