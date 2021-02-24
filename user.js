const express=require('express');
const bcrypt=require('bcryptjs');
const route=express.Router();
const jwt=require('jsonwebtoken');
const User=require('../model/user');

const {check,validationResult}=require('express-validator');

route.post('/',[
    check('name','name is require').not().isEmpty(),
    check('email','email is required').not().isEmpty(),
    check('email','plese enter a email in valid formate').isEmail(),
    check('password','password is required').not().isEmpty()
],async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.json(error.array());
    }
    const {name,email,location,password}=req.body;
    try {
        const exist=await User.findOne({email});
        if(exist){
            return res.json({mes:'user allredy exist'});
        }
        const user=new User({
            name,
            email,
            location,
            password
        });
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        await user.save()
        const paylode={
            user:{
                id:user.id
            }
        }
        const token=await jwt.sign(paylode,'asdfghjkl');
        res.json({user,token});
    } catch (err) {
        console.log(err.message);
        res.json({mes:'server error'});
    }

});

module.exports=route;