const mongoose=require('mongoose');

const profileschema=new mongoose.Schema({
    user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
    },
    compny:{
        type:String
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    status:{
        type:String
    },
    skill:{
        type:[String],
        require:true
    },
    bio:{
        type:String
    },
    experience:[{
        tytel:{
            type:String
        },
        compny:{
            type:String
        },
        location:{
            type:String
        },
        description:{
            type:String
        }   
    }],
    education:[{
        school:{
            type:String,
        },
        degree:{
            type:String
        },
        fildofstudy:{
            type:String
        },
        discription:{
            type:String
        }
    }],
    social:{
        youtube:{
            type:String
        },
        facebook:{
            type:String
        },
        twitter:{
            type:String
        },
        Linkdin:{
            type:String
        }
    }

});
const profile=mongoose.model('profile',profileschema);
module.exports=profile;