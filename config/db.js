//Dependencies
const mongoose = require("mongoose")
const config = require("config")
const db = config.get("mongoURI")

//connect to our database
const connectDB = async () => {
    try {
     await mongoose.connect(db, {
         useNewUrlParser: true,
         useUnifiedTopology: true
     });
     
     console.log("MongoDB Connected...")
    } catch (err) {
        console.error(err.message)
        // exit process with fail
        process.exit(1)
    }
}

module.exports = connectDB