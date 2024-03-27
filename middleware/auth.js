const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");


    if(!token){
        return res.status(401).json({
            message: "No token provided"
        })
    }


    //verify token 
    try {
        const decode = await jwt.verify(token , process.env.JWT_SECRET) ;
        console.log(decode);
        req.user = decode 
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }



next() ;

  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};
