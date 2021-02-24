const express=require('express');
const route=express.Router();
const {check,validationResult}=require('express-validator');
const User=require('../Models/user');
const post=require('../Models/post');
const auth=require('../midelware/auth');
const user = require('../Models/user');

route.post('/',auth,[
    check('text','this fild is required').not().isEmpty()
   // check('name','this fild is required').not().isEmpty()    
],async (req,res) =>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        res.json({mes:error.array()});
    }
    //const user=User.
    const {
        text
    }=req.body;
    try{
        const user=await User.findOne({_id:req.user.id});
        const newpost={};
        newpost.user=req.user.id;
        newpost.name=user.name;
        newpost.text=text;
        posts=await new post(newpost);
        await posts.save();
        res.json({posts});

    }catch(err){
        console.log(err.message);
        res.send('server error');
    }

});
route.get('/me',auth,async (req,res)=>{
    try{
    const posts=await post.findOne({user:req.user.id});
    if(!posts){
        res.json({mes:'no post availabel'});
    }
    res.json({posts});
}catch(err){
    console.log(err.message);
    res.send('server error');
}
});
route.get('/',auth,async (req,res)=>{
    try{
    const posts=await post.find();
    if(!posts){
        res.json({mes:'no post availabel'});
    }
    res.json({posts});
}catch(err){
    console.log(err.message);
    res.send('server error');
}
});
route.delete('/:id',auth,async (req,res)=>{
    try {
        const posts=await post.findById(req.params.id);
        console.log(posts);
        if(posts.user.toString() !== req.user.id){
            res.json({mes:'you can not deleted post'});
        }
        await posts.remove();
        res.json({mes:'post deleted'});
    } catch (err) {
        console.log(err.message);
        res.send('server error');
    }
});
route.put('/like/:id',auth,async (req,res)=>{
        try {
            const posts=await post.findById(req.params.id);
            if(posts.likes.filter(key=>key.user.toString() === req.user.id).length>0){
                return res.json({mes:'you are allredy like this post'});
            }
            await posts.likes.push({user:req.user.id});
            await posts.save();
            res.json({posts});
        } catch (err) {
            console.log(err.message);
            res.send('server error');
        }
});
route.delete('/unlike/:id',auth,async (req,res)=>{
    try {
        const posts=await post.findById(req.params.id);
        if(posts.likes.filter(key=>key.user.toString()===req.user.id).length===0){
            res.json({mes:'post has not yet been like'});
        }    
        const index=await posts.likes.map(key=>key.user.toString()).indexOf(req.user.id);
        
        await posts.likes.splice(index,1);
        posts.save();
        res.json({mes:'you are successfully unlike this post'});
    } catch (err) {
        console.log(err.message);
        res.send('server error');
    }
});
route.put('/comment/:id',auth,async (req,res)=>{
    try {
        const posts=await post.findById(req.params.id);
        const user=await User.findOne({_id:req.user.id});
        const {text}=req.body;
        const comment={};
        comment.user=req.user.id;
        comment.text=text;
        comment.name=user.name;
        //console.log
        await posts.Comment.push(comment);
        await posts.save();
        res.json({posts});
    } catch (err) {
        console.log(err.message);
        res.send('server error');
    }
});
route.delete('/comment/:id/:comment_id',auth,async(req,res)=>{
    try {
        const posts=await post.findById(req.params.id);
        if(posts.Comment.filter(key => key.user.toString()===req.user.id).length===0){
            res.json({mes:'you are not a comment on this post'});
        }
        const index=await posts.Comment.map(key=>key.id).indexOf(req.params.comment_id);
        if(index!=-1){
        //console.log(index);
        await posts.Comment.splice(index,1);
        await posts.save();
        res.json({mes:'your comment deleted'});
        }
        res.json({mes:'this comment is allredy deleted'});
    } catch (err) {
        console.log(err.message);
        res.send('server error');
    }
});
module.exports=route;