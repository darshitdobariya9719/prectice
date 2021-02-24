const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
name:{
    type:String,
    require:true
},
email:{
    type:String,
    require:true,
},
date:{
    type:Date,
    default:Date.now
},
password:{
    type:String,
    require:true
},
password2:{
    type:String,
    require:true
}
});
const user=mongoose.model('user',userschema);
module.exports=user;