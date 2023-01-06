const express = require("express");
const User = require("../models/user.model");
const Event = require("../models/event.model")
const config = require("../config");

const jwt = require("jsonwebtoken");
const middleware =require("../middleware");
const router = express.Router();
const Profile = require("../models/profile.model");
const multer = require("multer");
const path = require("path");
const fileFilter = (req, file, cb) => {

  if (file.mimetype == "image/jpg" || file.mimetype == "image/png") {

    cb(null, true);

  } else {

    cb(null, false);

  }

};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.username + ".jpg");
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  fileFilter: fileFilter,
});

//adding and update profile image
router
  .route("/add/image")
  .patch(middleware.checkToken, upload.single("img"), (req, res) => {
    Profile.findOneAndUpdate(
      { username: req.username },
      {
        $set: {
          img: req.file.path,
        },
      },
      { new: true },
      (err, profile) => {
        if (err) return res.status(500).send(err);
        const response = {
          message: "image added successfully updated",
          data: profile,
        };
        return res.status(200).send(response);
      }
    );
  });

  router.route("/add").post(middleware.checkToken, (req, res) => {
    
    const profile = Profile({
    user_id: req.userId,
    username: req.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    university: req.body.university,
    job: req.body.job,
    DOB: req.body.DOB,
    bio: req.body.bio,
  });
  profile
    .save()
    .then(() => {
      return res.json({ msg: "profile successfully stored" });
    })
    .catch((err) => {
      return res.status(400).json({ err: err });
    });
}); 

// Check Profile data

router.route("/checkProfile").get(middleware.checkToken, (req, res) => {
  Profile.findOne({ username: req.username }, (err, result) => {
    if (err) return res.json({ err: err });
    else if (result == null) {
      return res.json({ status: false, username: req.username });
    } else {
      return res.json({ status: true, username: req.username });
    }
  });
});
router.route("").get(middleware.checkToken, async (req, res) => {
    try{
      

      const [profile, event] = await Promise.all([
       
        Profile.findOne({ username: req.username }),
        Event.find({creator: req.userId}).sort ( { startDate : -1  } )
      ]);
      const combinedResults = {
        profile,
        event
      };
  
     
      res.json(combinedResults);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error executing the queries." });
    }
 
   
    
});


router.route("/:id").get(middleware.checkToken, async(req,res,next) => {
    try {
        
  
        const event = await Event.findOne({
          _id: req.params.id,
          creator: req.userId
          
        }).populate('attendence');
       
        if (!event) {
          return res.status(404).send();
        }
        
    
        res.send(event);
      } catch (e) {
        res.status(500).send(e);
      }
    });

router.route("/:id").delete(middleware.checkToken, async(req,res,next) => {
        try {
            
           
            const event = await Event.findOne({
              _id: req.params.id,
              creator: req.userId
              
            });
           
            if (!event) {
              return res.status(404).send();
            }
//             User.findById(req.userId)
//             .populate('myEvents')
//             .exec((error, user) => {
//              if (error) {
//                 res.status(500).send(error);
//             } else {
//             console.log(event);  
//             user.myEvents = user.myEvents.filter(function(e) {
//                 return e._id.toString() !== event._id.toString();
//             });
//             user.save((error) => {
//             if (error) {
//                 res.status(500).send(error);
//               } else {
//                console.log("success");
//              }
//      });
//    }
//  });
//  //delete event from each user events_to_attend
 
  
  const attending_users  = await User.find({ events_to_attend: { $in: [req.params.id] } });

  console.log(attending_users);
  attending_users.forEach(function(user) {
    User.updateOne({ _id: user._id }, { $pull: { events_to_attend:  req.params.id} }, function(err) {
        if (err)
        console.log(err)
    });
  });
  
    Event.deleteOne({ _id: req.params.id }, function(err) {
        if (err)
        res.status(500).send(err);
        else
        res.status(204).send();
});
    
           
          } catch (e) {
            res.status(500).send();
          }
        });


router.route("/update").patch(middleware.checkToken, async (req, res) => {
  let profile = {};
  await Profile.findOne({ username: req.username }, (err, result) => {
    if (err) {
      profile = {};
    }
    if (result != null) {
      profile = result;
    }
  });
  Profile.findOneAndUpdate(
    { username: req.username },
    {
      $set: {
        firstname: req.body.firstname ? req.body.firstname : profile.firstname,
        lastname: req.body.lastname ? req.body.lastname : profile.lastname,
        job: req.body.job
          ? req.body.job
          : profile.job,
        DOB: req.body.DOB ? req.body.DOB : profile.DOB,
        university: req.body.university ? req.body.university : profile.university,
        bio: req.body.bio ? req.body.bio : profile.bio, //bio:""
      },
    },
    { new: true },
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result == null) return res.status(404).json();
      else return res.status(200).json();
    }
  );
});
module.exports = router;