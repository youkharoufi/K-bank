const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    current:{
        type:Number,
        default:0
    },
    montantsDepot:{
        type:Array
    },
    montantsRetrait:{
        type:Array
    }
});

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model('User',userSchema);

module.exports=User;