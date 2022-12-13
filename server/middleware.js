const jwt = require("jsonwebtoken");
const config = require("./config");
const dotenv = require('dotenv');
dotenv.config();

const checkToken =(req,res,next)=>{
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    try {
        const token = req.header(tokenHeaderKey);
        if(token)
        {
        
          const verified = jwt.verify(token, jwtSecretKey,function(err, decodedToken){
            if(err) { /* handle token err */ }
            else {
             req.userId = decodedToken.userId;   // Add to req object
             console.log( decodedToken.userId);
             next();
            }
          } );
        //   if(verified){
        //     return res.send("Successfully Verified");
        //   }else{
        //     // Access Denied
        //     return res.status(401).send(error);
        //   }
       }
       else{
        return res.json({
            status:false,
            msg:"Token is not provided"
        })
    }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
    // let token  = req.headers["authorization"];
    // console.log(token.id);
    // console.log(token);
    // token= token.slice(7,token.length);
    // if(token){
    //     jwt.verify(token,config.key,(err,decoded)=>{
    //         if(err){
    //             return res.json({
    //                 status:false,
    //                 msg:err
                    
    //             })
    //         }
    //         else{
    //             req.decoded=decoded;
    //             next();
    //         }
    //     });

    // }
    // else{
    //     return res.json({
    //         status:false,
    //         msg:"Token is not provided"
    //     })
    // }
};
module.exports ={
    checkToken:checkToken, 
}; 