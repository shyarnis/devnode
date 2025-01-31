import mongoose from "mongoose"
import { MONGO_URI } from "../constants/env";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;