const express=require('express');
const route=express.Router();
const {check,validationResult}=require('express-validator');
const profiledata=require('../Models/profile');
const User=require('../Models/user');
const auth=require('../midelware/auth');
route.get('/me',auth,async (req,res)=>{
    try{
    const profile=await profiledata.findOne({user:req.user.id});
    if(!profile){
        res.json({mes:'you have no profile'});
    }
    res.json({profile});
   }catch(err){
       res.send('server error');
   }
});
route.get('/',async (req,res)=>{
    try{
    const profile=await profiledata.find();
    if(!profile){
        res.json({mes:'you have no profile'});
    }
    res.json({profile});
   }catch(err){
       res.send('server error');
   }
});
route.delete('/',auth,async (req,res)=>{
    try{
    await profiledata.findOneAndDelete({user:req.user.id});
    await User.findOneAndDelete({_id:req.user.id});
    res.json({mes:'user delete!'});
   }catch(err){
       res.send('server error');
   }
});
route.post('/',auth,[
    check('skill','skill is reqierd').not().isEmpty()
],async (req,res) => {
    const error=validationResult(req);
    if(!error.isEmpty()){
        res.json(error.array());
    }
    const {compny,
        website,
        location,
        bio,
        status,
        skill,
        youtube,
        facebook,
        twitter,
        Linkdin}=req.body;
    const profilefild={};
    profilefild.user=req.user.id;
    if(compny)profilefild.compny=compny;
    if(website)profilefild.website=website;
    if(location)profilefild.location=location;
    if(bio)profilefild.bio=bio;
    if(status)profilefild.status=status;
    if(skill){
        profilefild.skill=skill.split(',').map(skil=>skil.trim());
    };
    profilefild.social={}
    if(youtube)profilefild.social.youtube=youtube;
    if(facebook)profilefild.social.facebook=facebook;
    if(twitter)profilefild.social.twitter=twitter;
    if(Linkdin)profilefild.social.Linkdin=Linkdin;
    try{
        let profile=await profiledata.findOne({user:req.user.id});
        //let profiledata=await profiledata.findOne({user:req.user.id});
        if(profile){
            profile=await profiledata.findOneAndUpdate({user:req.user.id},{$set:profilefild},{new:true});
            //profiledata.findOneAndUpdate({user:req.user.id},{$set:profilefild});
           return res.json({profile});
        }

    
    profile=new profiledata(profilefild);
    await profile.save();
    res.json({profile});
}catch(err){
    console.log(err.message);
    res.send('server error');
}
});
route.put('/experiance',auth,[
check('tytel','this fild is not empty').not().isEmpty(),
check('compny','this fild is required').not().isEmpty()
],async (req,res)=>{
  const error=validationResult(req);
  if(!error.isEmpty()){
      res.json({error:error.array()});
  }
  const {tytel,
        compny,
        location,
        description}=req.body;
    const newexpirence={
        tytel,
        compny,
        location,
        description
    };
    try{
    const profile=await profiledata.findOne({user:req.user.id});
    profile.experience.unshift(newexpirence);
    await profile.save();
    res.json({profile});
    }catch(err){
        res.send('server error');
    }
});
route.delete('/experiance/:exp_id',auth,async (req,res)=>{
    try{
        const profile=await profiledata.findOne({user:req.user.id});
        const index=await profile.experience.map(key => key.id).indexOf(req.params.exp_id);
        profile.experience.splice(index,1);
        await profile.save();

        //await profile.experience.findOneAndDelete({_id:req.params.exp_id});
        //console.log(profile.experience);
        res.json({mes:'expirence deleted'});
    }catch(err){
        console.log(err.message);
        res.send('server error');
    }
});
route.put('/education',auth,[
    check('school','this fild is required').not().isEmpty(),
    check('degree','this fild is required').not().isEmpty(),
    check('fildofstudy','this fild is required').not().isEmpty(),
],async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty){
        res.json({mes:error.array()});
    }
    //const profile=await profiledata.findOne({user:req.user.id});
    const {
        school,
        degree,
        fildofstudy,
        discription
    }=req.body;
    const neweducation={
        school,
        degree,
        fildofstudy,
        discription
    };
    try{
        const profile=await profiledata.findOne({user:req.user.id});
        await profile.education.push(neweducation);
        await profile.save();
        res.json({profile});
    }catch(err){
        console.log(err.message)
        res.send('server error');
    }
});
route.delete('/education/:edu_id',auth,async (req,res)=>{
    try{
        const profile=await profiledata.findOne({user:req.user.id});
        const index=await profile.education.map(key=>key.id).indexOf(req.params.edu_id);
        await profile.education.splice(index,1);
        await profile.save();
        res.json({mes:'education deleted'});
    }catch(err){
        console.log(err.message);
        res.send('server error');
    }
});
module.exports=route;