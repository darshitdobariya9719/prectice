const express=require('express');
const route=express.Router();
const User=require('../Models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config')
const {check,validationResult}=require('express-validator');
route.post('/',[
    check('name','name is require').not().isEmpty(),
    check('email','email is not formeted').isEmail(),
    check('password','password is minimum lenth is 6').isLength({min:6})
],async (req,res)=>{
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //console.log(req.body);
    const {name,email,password,password2}=req.body;
    try{
        let user=await User.findOne({email});
        if (user){
            res.status(400).json({errors:[{msg:'user is allredy exist'}]});
        }
        user=new User({
            name,
            email,
            password,
            password2
        });
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        user.password2=await bcrypt.hash(password2,salt);
        await user.save();
        const paylode={
            user:{
                user:user.id
            }
        };
        const token=jwt.sign(paylode,'qwertyuiop',{
            expiresIn:360000},
            (err,token)=>{
                if (err) throw err;
                res.json({token});
            });

    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }

    //res.send('user....')
});

module.exports = route;