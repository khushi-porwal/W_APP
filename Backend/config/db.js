const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected Successfully");
    } catch(err) {
        console.error("MongoDB Connection Failed:", err.message);
        process.exit(1) //process.exit(1) stops the server because running without a database doesn't make sense
    }
}

module.exports = connectDB;

