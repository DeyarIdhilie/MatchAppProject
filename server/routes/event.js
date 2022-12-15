const express = require("express");
const User = require("../models/user.model");
const Event = require("../models/event.model")
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");

const uploadImage = require('../helpers/helpers')

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
            attendence: req.body.attendence,
            tags: req.body.tags
          });
          event.save();
          res.status(201).json("success");
      } catch (error) {
        next(error)
      }
        
     

    
});
router.get("",middleware.checkToken, async(req,res,next)=>{

    try {
        console.log(req.userId);
        let timeNow = new Date();
        const query = { startDate: { $gt: timeNow }, creator:{ $ne: req.userId} };
        const options = {
           
            projection: { attendence:0 },
          };
          
        const events = await Event.find(query, options);
    
        const count = events.length;
        var i;
        for (i = 0; i < count; i++) {
          await events[i].populate("creator").execPopulate();
        
        }
        
    
    
    
        res.send(events);
      } catch (e) {
        res.status(500).send();
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