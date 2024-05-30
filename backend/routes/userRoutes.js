const express=require('express');
const router=express.Router();
const {authUser,registerUser,checkUser,allUsers}=require('../controllers/userControl');
const { body } = require('express-validator');
const protect=require('../middlewares/authMid');

router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  ],authUser);


router.post('/signup',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  ],registerUser);
  
  router.post('/checkUser',[
    body('email', 'Enter a valid email').isEmail(),
  ],checkUser);

router.get("/",protect,allUsers);

module.exports=router;