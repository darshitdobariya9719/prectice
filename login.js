const express=require('express');
const route=express.Router();
const User=require('../model/user');
const bcrypt=require('bcryptjs');
const auth=require('../middleware/auth');
const crypto=require('crypto');
const resate=require('../middleware/resate');
const sendEmail=require('../mail/email');
const {check,validationResult}=require('express-validator');

route.post('/',[
    check('email','email is required').not().isEmpty(),
    check('email','plese enrter valid email').isEmail(),
    check('password','password is required').not().isEmpty()
],async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.json(error.array());
    }
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.json({mes:'user not exist'});
    }
    const exist=await bcrypt.compare(password,user.password);
    if(!exist){
        return res.json({mes:'user not exist'});
    }
    res.json({user});
});
route.get('/',auth,async(req,res)=>{
    try{
    const user=await User.findOne({_id:req.user.id});
    res.json(user);
    }catch(err){
        console.log(err.message);
        res.send('server error');
    }
});
/*route.post('/resatepassrord',async(req,res)=>{
    const {email}=req.body;
    try {
        const user=await User.findOne({email});
        if(!user){
            res.json({mes:'user not exist'});
        }
        const token=await crypto.randomBytes(32).toString('hex');
        user.passwordResettoken=await crypto.createHash('sha256').update(token).digest('hex');
        user.passwordResetExpiar=Date.now() + 10*60*1000;
        await user.save();
        console.log(token);
        res.json({user});
    } catch (err) {
        console.log(err.message);
        res.json({mes:'server error'});
    }
});*/
route.post('/forgatepassrord',resate,async(req,res)=>{
    const token=req.token;
    console.log(token);
    const url=`${req.protocol}://${req.get('host')}/api/login/resatepassword/${token}`;
    const message=`forgot your password then click ${url} heare`;
    try{
    await sendEmail({
        email:req.user.email,
        subject:'password resate link',
        message
    });
    res.json({mes:'email send'});
}catch(err){
    console.log(err.message);
    res.json({mes:'server error'});
}
});
route.patch('/resatepassword/:token',async(req,res)=>{
    const token=await crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(token);
    const user=await User.findOne({passwordResettoken:token,passwordResetExpiar:{$gt:Date.now()}});
    if(!user){
        return res.json({mes:'this link is time out'});
    }
    const {password}=req.body;
    const salt=await bcrypt.genSalt(10);
    const newpassword=await bcrypt.hash(password,salt);
    user.password=newpassword;
    user.passwordResettoken=undefined;
    user.passwordResetExpiar=undefined;
    await user.save();
    res.json({mes:'password change'});
});
module.exports=route;
