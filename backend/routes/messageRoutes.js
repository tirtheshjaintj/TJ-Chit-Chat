const express=require('express');
const router=express.Router();
const {sendMessage,allMessage}=require('../controllers/messsageControl');
const protect=require('../middlewares/authMid');
router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,allMessage);




module.exports=router;