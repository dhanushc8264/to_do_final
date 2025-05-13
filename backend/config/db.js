import mongoose from "mongoose";


const connectDb = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log('Database connected successfully')
    }
    catch(err)
    {
        console.log(`error in mongo ${err}`)
        process.exit(1)
    }
}

export default connectDb;