const express = require("express");
const User = require("../models/user.model");
const Event = require("../models/event.model")
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");

router.get("", async(req,res,next)=>{

    try {
        
        
         console.log("index");
        let timeNow = new Date();
     
        
       
        const query = { startDate: { $gt: timeNow } };
        console.log(query);
        const options = {
           
            projection: { attendence:0 },
          };
          
        const events = await Event.find(query, options);
    
        const count = events.length;
        var i;
        for (i = 0; i < count; i++) {
          await events[i].populate( 'creator',
         { "username":1}).execPopulate();
        
        
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
  module.exports = router;