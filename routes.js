const { signUp , login , sendOTP, selectedCategory} = require("./controllers/Auth") ;

const {auth} = require("./middleware/auth") 

const router = require('express').Router(); 


router.post('/signup', signUp);

router.post('/login', login);

router.post('/sendOTP', sendOTP);

router.get('/category' , selectedCategory)


module.exports = router