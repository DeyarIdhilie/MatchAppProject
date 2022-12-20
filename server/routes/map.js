const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");

router.patch("",middleware.checkToken,(req, res)=>{
   
    User.findOneAndUpdate(
        {_id: req.userId},
        {$set: {location: req.body.location}},
        (err,result) => {
            if(err) return res.status(500).json({msg:err});
            console.log("added location");
            const msg ={
                msg: "location added",
               
            };
            return res.json(msg);
        }
    );
});
router.get("/users",middleware.checkToken,(req,res)=>{ 

    User.findOneAndUpdate(
        {_id: req.userId},
        {$set: {location: req.body.location}}, { new: true }).then(user => {
        console.log(user);  // updated user document
     });
    
    // console.log(req.userId);
    User.aggregate([
        
        {
            $geoNear: {
                    near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
                        }
                    },
                        distanceField: "distance",
                        $maxDistance: 50000,
                        hint: { coordinates: "2dsphere" },
                        spherical: true
                        }
                    }
         
        ,
        {
            
            $match: {
                
               _id: { $ne: req.userId },  // exclude documents with matching _id
               distance: { $lt: 50000 },  // only
               username: { $ne: req.username }
               // only
            }
         },
         {
            $project: {
              
               is_admin: 0,
               events_to_attend: 0,
               tags: 0,
               password: 0,
               phonenumber: 0,
               email: 0
        
            }
         },
        {
            $lookup: {
                from: "profiles",
                localField: "username",
                foreignField: "username",
                as: "profile"
            }
        }
        
        
    ]).exec().then(function(result) {
       
        res.send(result);
    });
    
});
 module.exports = router;
