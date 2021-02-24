const crypto=require('crypto');
const User=require('../model/user');
module.exports= async(req,res,next)=>{
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
        //res.json({user});
        req.user=user;
        req.token=token;
        next()
    } catch (err) {
        console.log(err.message);
        res.json({mes:'server error'});
    }
};