const User = require("../models/User");
const OTP = require("../models/OTP");
const Category = require("../models/Category");
const optGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//sendotp

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: true,
        message: "User Already Exist",
      });
    }

    let otp = optGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("your generated otp ->", otp);

    const result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = optGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    const optBody = await OTP.create(otpPayload);
    console.log(" your otpBody ->  ",optBody);
    res.status(200).json({
      success: true,
      message: "OTP Send Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

//signup

exports.signUp = async (req, res) => {
  try {
    const { email, userName, password , otp  } = req.body;
    console.log("your body wala OTP ->", typeof(otp));
    if (!email || !userName || !password || !otp)  {
      return res.status(403).json({
        success: false,
        message: "Please Fill All Fields",
      });
    }

    const existingUser = await User.findOne({ email });
   
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User Already Exist",
      });
    }

    const recentOtp = await OTP.find({ email })
      
    console.log("your recent OTP -> ", typeof(recentOtp[0].otp).toString());
    console.log("your recent OTP  Length-> ", recentOtp.length);
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The OTP not found in db ",
    });
     }
    
    else if (otp !== recentOtp[0].otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not Matched",
      });
    } 
    //   hash password
  
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          userName,
          email,
          password: hashedPassword,
           
        });
  
        return res.status(200).json({
          success: true,
          message: "User Created Successfully",
          user,
        });
  
 
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Please Fill All Fields",
      });
    }
    const existingUser = await User.findOne({ email });
    console.log("existingUser  ->  ", existingUser)
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }
    if (await bcrypt.compare(password, existingUser.password)) {
        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id,   },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        // Save token to user document in database
        existingUser.token = token;
        existingUser.password = undefined;
        // Set cookie for token and return success response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            existingUser,
            message: `User Login Success`,
        });
    } else {
        return res.status(401).json({
            success: false,
            message: `Password is incorrect`,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure , Something Went Wrong",
    });
  }
};


exports.selectedCategory = async ( req ,res ) => {
  try {
    const { id , name } = req.body ;

    const selectedItems = await Category.findOne({id}) ;
    if(selectedItems) {
      await Category.findOneAndDelete({id}) 
    }
    else{
       await Category.create({id, name}) ;
    }
    console.log(selectedItems)
    const item = await Category.findOne({id}) ;
    res.status(200).json({
      success: true,
      message: "Category Selected Successfully",
      item
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
 





}
