const express=require('express');
const protect=require('../middlewares/authMid');
const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}=require('../controllers/chatControl');
const router=express.Router();

router.route("/")
.post(protect,accessChat)
.get(protect,fetchChats);

router.route('/group')
.post(protect,createGroupChat);

router.route('/rename').put(protect,renameGroup);
router.route('/groupremove').put(protect,removeFromGroup);
router.route('/groupadd').put(protect,addToGroup);

module.exports=router;