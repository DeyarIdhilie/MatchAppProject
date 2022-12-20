const express = require("express");
const User = require("../models/user.model");
const Event = require("../models/event.model")
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");

const uploadImage = require('../helpers/helpers')
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyAwxVL81WZGrsYiSFmtOCGSCsRXoc4_fk4', // for Mapquest, OpenCage, Google Premier
  formatter: 'json' // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);


router.post("",middleware.checkToken, async(req, res, next)=>{
   
    try {
        const myFile = req.file
        const imageUrl = await uploadImage(myFile)
        const event = new Event({
            creator: req.userId,
            image : imageUrl,
            title: req.body.title,
            description : req.body.description,
            startDate : req.body.startDate,
            endDate:req.body.endDate,
            maxCapacity: req.body.maxCapacity,
            geometry: req.body.geometry,
            attendence: req.userId,//save user as the first attendet when he create an event
            tags: req.body.tags
            
          });
          event.save();
          //push created event to virtual myEvents field in the user scheme
          User.findById(req.userId)
             .populate('myEvents')
             .exec((error, user) => {
              if (error) {
                console.log(error);
             } else {
             console.log(event);  
             user.myEvents.push(event);
             user.save((error) => {
             if (error) {
                console.log(error);
               } else {
                console.log("success");
              }
      });
    }
  });
          res.status(201).json("success");
      } catch (error) {
        next(error)
      }
        
     

    
});
router.get("",middleware.checkToken, async(req,res,next)=>{

    try {
        
        
        // console.log(req);
        let timeNow = new Date();
        let filter = {};
        if(req.url.includes('?')){
            console.log("tag filtering");
            filter = { startDate: { $gt: timeNow }, creator:{ $ne: req.userId}, tags:  req.query.tag  };//tags:{ $contains: req.query.tag } };
        }
        else{
            console.log("no tag filtering");
            filter = { startDate: { $gt: timeNow }, creator:{ $ne: req.userId} };
        }
        const query = filter;
        console.log(query);
        const options = {
           
            projection: { attendence:0 },
          };
          
        const events = await Event.find(query,{ "attendence": 0 });
        console.log(events);
        const count = events.length;
        var i;
        for (i = 0; i < count; i++) {
          await events[i].populate("creator", { "username":1,"_id":1}).execPopulate();
       
        
        }
        res.send(events); 
    }catch (e) {
        res.status(500).send(e);
      }
});
router.get("/:id",  async (req, res) => {
    try {
      console.log("get event by id")
      const projection = { attendence: 0 };

      const event = await Event.findOne({
        _id: req.params.id,
        
      }, { "attendence": 0 });
      if (!event) {
        return res.status(404).send();
      }
  
      res.send(event);
    } catch (e) {
      res.status(500).send();
    }
  });
  router.patch("/:id", middleware.checkToken, async (req, res) => {
    try {
          
      const event = await Event.findOne({
        _id: req.params.id,
        
      });
      const user = await User.findOne({
        _id: req.userId,
        
      });
     
      if (event && user) {
        if(! event.attendence.includes(req.userId)){
        if(event.attendence.length != event.maxCapacity){
            if(event.creator != req.userId){
             event.attendence.push(req.userId);
             user.events_to_attend.push(req.params.id);
             user.save();

              event.save();
             res.status(201).json("success");
            }
            else 
            res.status(400).json("You created that event");
        }
        else
        res.status(400).json("Sorry,event is full");
    }
    else 
       res.status(400).json("U already joined");
      }
      return res.status(404).send();
     
    } catch (e) {
      res.status(500).send();
    }
  });
 module.exports = router;