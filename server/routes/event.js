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

 module.exports = router;