const mongoose=require('mongoose');

const mouvementSchema=mongoose.Schema({
    montantDepot:{
        type:Number,
        
    },
    montantRetrait:{
        type:Number,
    },

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    expire_at: {
        type: Date, default: Date.now, expires: 60
    }
    
})

const Mouvement=mongoose.model('Mouvement',mouvementSchema);

module.exports=Mouvement;