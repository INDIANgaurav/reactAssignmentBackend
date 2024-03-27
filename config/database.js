const mongoose = require('mongoose') ;
require("dotenv").config() ;
const database = () => {
   try {
       mongoose.connect(process.env.MONGO_URI )
       .then(() => console.log("db connected successfully"))
   } catch (error) {
       return error.message;
   }
}

module.exports = { database }