//require the express package
const express = require("express")

//be able to use the express package
const app = express()

//sending api running to the browser
app.get("/", (req, res) => res.send("API Running"));

//creatting the correct port number
const PORT = process.env.PORT || 5000;

// listening on port 5000
app.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`))