const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");

router.route("/:username").get(middleware.checkToken, (req, res) => {
    User.findOne({ username: req.params.username }, (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      return res.json({
        data: result,
        username: req.params.username,
      });
    });
  });

router.route("/checkusername/:username").get((req, res) => {
    User.findOne({ username: req.params.username }, (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if (result !== null) {
        return res.json({
          Status: true,
        });
      } else
        return res.json({
          Status: false,
        });
    });
  });

router.route("/login/email").post((req,res)=>{
    User.findOne({email :req.body.email}, (err ,result)=>{
        if(err) res.status(500).json({msg : err});
        if(result === null)
        {
            res.status(403).json("email is incorrect")
        }
        if(result.password === req.body.password){
            console.log(result._id);
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            let data = {
                time: Date(),
                userId: result._id,
                username: result.username
            }
          
            let token = jwt.sign(data, jwtSecretKey);
          
       
            res.status(201).json({
                token:token,
            "msg":"success"});
        }
        else{
            res.status(403).json("password is incorrecct")
        }
    });
});


router.route("/login/phonenumber").post((req,res)=>{
    User.findOne({phonenumber :req.body.phonenumber}, (err ,result)=>{
        if(err) res.status(500).json({msg : err});
        if(result === null)
        {
            res.status(403).json("phonenumber  is incorrect")
        }
        if(result.password === req.body.password){
            console.log(result._id);
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            let data = {
                time: Date(),
                userId: result._id,
                username: result.username
            }
          
            let token = jwt.sign(data, jwtSecretKey);
           
            
            res.json({
                token:token,
            "msg":"success"});
        }
        else{
            res.status(403).json("password is incorrecct")
        }
    });
   
    
});


router.route("/register").post((req,res)=>{
    console.log("inside the register");
    const user = new User({
        
        username: req.body.username,
        password: req.body.password,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
       
        
    });
    user.save().then(()=>{
        console.log("user registered");
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
            let data = {
                time: Date(),
                userId: user._id,
                username: user.username
            }
          
            let token = jwt.sign(data, jwtSecretKey);
           
            
            res.status(200).json({ token:token});
       
    }).catch((err)=>{
        res.status(403).json({msg:err});
        console.log(err);
    });
    // 
    return res;
});

router.route("/update/:email").patch(middleware.checkToken,(req, res)=>{
    User.findOneAndUpdate(
        {email: req.params.email},
        {$set: {password:req.body.password}},
        (err,result) => {
            if(err) return res.status(500).json({msg:err});
            console.log("password updated");
            const msg ={
                msg: "password sucessfully updated",
                email: req.params.email,
            };
            return res.json(msg);
        }
    );
});

router.route("/delete/:email").delete(middleware.checkToken,(req, res)=>{
    User.findOneAndDelete(
        {email: req.params.email},
        (err,result) => {
            if(err) return res.status(500).json({msg:err});
            const msg ={
                msg: "user deleted",
                email: req.params.email,
            };
            return res.json(msg);
        }
    );
});

module.exports = router;