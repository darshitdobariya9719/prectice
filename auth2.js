const express=require('express');
const route=express.Router();
const autht=require('../midelware/auth');
const User=require('../Models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {check,validationResult}=require('express-validator');

route.get('/',autht,async (req,res)=> {
    try{
    const data=await User.findById(req.user.id);
    res.json({data});
    }
    catch(err){
        console.log(err.message);
    }
}
);
route.post('/',[
    check('email','user name not correct formet').isEmail(),
    check('password','password is required').exists()
],async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        res.json({error:error.array()});
    }
const {email,password}=req.body;
const user=await User.findOne({email});
if (!user){
    res.json({mes:'user not exist'});
}
const isExist=await bcrypt.compare(password,user.password);
if(!isExist){
    res.json({mes:'password is not correct'});
}
const playlode={
    user:{
        id:user.id
    }
}
const token=jwt.sign(playlode,'qwertyuiop',{
    expiresIn:3600000
},(err,token)=>{
      if(err) throw err;
      res.json({token});
    });
})
module.exports=route;