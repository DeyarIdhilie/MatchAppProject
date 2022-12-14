const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();
const Port = process.env.port ||5000;
const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("mongoDb connected");
})
app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user",userRoute);
const mapRoute = require ("./routes/map");
app.use("/map",mapRoute)
mongoose.connect(process.env.Mongo_URI,
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,}
        )
       
.then(()=>{
app.listen(Port, "0.0.0.0",()=>console.
log("your server is running the port No."+Port));
})
.catch((error)=>{
    console.log("Can't connect to mongodb atlas,the error is :"+error)
})
connection.once("open",()=>{console.log("Everything's gonna be alright")})

app.get("/", (req, res) => {
    res.send("I will be shown on the Browser");
    console.log("I will be shown on the Terminal");
});
