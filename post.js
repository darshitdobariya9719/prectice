const mongoose=require('mongoose');
const user = require('./user');

const postschema=new mongoose.Schema({
  user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
  },
  text:{
      type:String,
  },
  name:{
    type:String,
    require:true
  },
  likes:[{
      user:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'user'
      },
   }],
   Comment:[{
       user:{
           type:mongoose.Schema.Types.ObjectId,
           ref:'user'
       },
       text:{
           type:String
       },
       name:{
           type:String
       },
       date:{
           type:Date,
           default:Date.now
       }
   }],
   date:{
       type:Date,
       default:Date.now
   }
});
const post=mongoose.model('post',postschema);
module.exports=post;