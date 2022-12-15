const express = require("express");
const User = require("../models/user.model");
const Event = require("../models/event.model")
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware =require("../middleware");

router.get("",middleware.checkToken, async(req,res,next)=>{

    try {
        
       
        let date = new Date(); 
       
        let month = date.getUTCMonth() + 1;
        let year = date.getUTCFullYear();
        let day;
        let flag = 0;
        
        
        function getDays(year, month) {
            
            return new Date(year, month, 0).getDate();
        };
        
         if(req.url.includes('?')){
            if (req.query.month){
                month = req.query.month;
            }
            if (req.query.year){
                year = req.query.year; 
            }
            if (req.query.day){
                flag = 1;
                day = req.query.day; 
            }
         }
         
         if (flag == 0){
         
         const days = getDays(year,month)
       
         const findResult = await Event.find({
           
            creator: req.userId,
            startDate: {
              $gte: new Date(new Date(year,month-1,1).setHours(00, 00, 00)),
              $lt: new Date(new Date(year,month-1,days).setHours(23, 59, 59)),
            },
          },{"_id":0, "startDate":1});
          const count = findResult.length;
        
          let array_of_days=[];
          var i;
          for (i = 0; i < count; i++) {
            var dt = new Date(findResult[i].startDate);
            array_of_days.push(dt.getDate());
          }
          res.send(array_of_days); 
         }
         else if (flag ==1){
            
            const findResult = await Event.find({
           
                creator: req.userId,
                startDate: {
                  $gte: new Date(new Date(year,month-1,day).setHours(00, 00, 00)),
                  $lt: new Date(new Date(year,month-1,day).setHours(23, 59, 59)),
                },
              });
              res.send(findResult); 
         }

    }catch (e) {
        res.status(500).send(e);
      }
});
module.exports = router;