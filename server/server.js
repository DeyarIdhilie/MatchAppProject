const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const multer = require('multer')
require('dotenv').config();
const app = express();
const Port = process.env.port ||5000;

const uploadImage = require('./helpers/helpers')


const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
})

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/uploads', async (req, res, next) => {
  try {
    const myFile = req.file
    const imageUrl = await uploadImage(myFile)
    res
      .status(200)
      .json({
        message: "Upload was successful",
        data: imageUrl
      })
  } catch (error) {
    next(error)
  }
})

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})

const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("mongoDb connected");
})
app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user",userRoute);
const mapRoute = require ("./routes/map");
app.use("/map",mapRoute)
const eventRoute = require ("./routes/event");
app.use("/events",eventRoute)
const calenderRoute = require ("./routes/calender");
app.use("/calender",calenderRoute)
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

