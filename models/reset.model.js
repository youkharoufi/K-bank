const mongoose=require('mongoose');

const resetSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
        
    },
    resetPasswordToken:{
        type:String,
        required:true
    },
    resetExpires:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
    
})

const Reset=mongoose.model('Reset',resetSchema);

module.exports=Reset;