import mongoose from "mongoose";

const connectMongo= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Db Connected Successfully ")
    }catch(error){
        console.log("Mongo DB connection Failed");
        process.exit(1);
    }
}

export default connectMongo;