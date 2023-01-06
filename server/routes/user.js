const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");
const Profile = require("../models/profile.model");
const Event = require("../models/event.model")
const itemRouter = express.Router({mergeParams: true});
router.route("/:username").get(middleware.checkToken, (req, res) => {
    User.findOne({ username: req.params.username }, (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      return res.json({
        data: result,
        username: req.params.username,
      });
    });
  });
 
// router.use('/:userId/items', itemRouter);
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

  router.route("/checkusername/:username/profile").get( async (req, res) => {
       
    try{

       
      const aggregation = await User.aggregate([
            {
            
            $match: {
                
                username: req.params.username 
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
    ]) .exec();
    await Promise.all(aggregation.map(async (user) => {
        await User.populate(user, { path: 'myEvents' });
        res.json(user);
      }));    
 
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error executing the queries." });
      }
   

  });

router.route("/checkusername/:username/profile/:id").get( async (req, res) => {
    try {
        
  
        const event = await Event.findOne({
          _id: req.params.id,
          
          
        });
       
        if (!event) {
          return res.status(404).send();
        }
        
    
        res.send(event);
      } catch (e) {
        res.status(500).send();
      }
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
   
    user.save(function (err, newUser) {
        // console.log("save");
        
        if (err) {
            
            if (err.code === 11000 && err.keyValue.hasOwnProperty('email')) {
                res.status(400).json({msg: 'email is already in use'});
                
            }  
            else if (err.code === 11000 && err.keyValue.hasOwnProperty('username')) {
                res.status(400).json({msg: 'username is already in use'});
               
            }  
            else if (err.code === 11000 && err.keyValue.hasOwnProperty('phonenumber')) {
                res.status(400).json({msg: 'phonenumber is already in use'});
                
            }  
            else 
            console.log(err);
           
        }
        else {
     
              let jwtSecretKey = process.env.JWT_SECRET_KEY;
               let data = {
              time: Date(),
           userId: newUser._id,
           username: newUser.username
       }
     
       let token = jwt.sign(data, jwtSecretKey);
      
       
       
       res.status(201).json({ token:token});
        }
    })
   
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