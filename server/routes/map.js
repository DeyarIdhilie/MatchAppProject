const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");

router.patch("",middleware.checkToken,(req, res)=>{
   
    User.findOneAndUpdate(
        {_id: req.userId},
        {$set: {geometry: req.body.geometry}},
        (err,result) => {
            if(err) return res.status(500).json({msg:err});
            console.log("added location");
            const msg ={
                msg: "location added",
                email: req.params.email,
            };
            return res.json(msg);
        }
    );
});
router.get("/users",(req,res)=>{ 
    User.aggregate().near({
        near: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
        maxDistance: 100000,
        spherical: true,
        distanceField: "dist.calculated"
       }).then(function(users){
        res.send(users);
    });
});

 module.exports = router;
