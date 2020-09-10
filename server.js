//require the express package
const express = require("express")
const connectDB = require("./config/db")

//be able to use the express package
const app = express()

//connect to our database
connectDB()

//Init middleware
app.use(express.json({extended: false}))

//sending api running to the browser
app.get("/", (req, res) => res.send("API Running"));

//Define all Routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profiles", require("./routes/api/profiles"))
app.use("/api/posts", require("./routes/api/posts"))

//creatting the correct port number
const PORT = process.env.PORT || 5000;

// listening on port 5000
app.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`))