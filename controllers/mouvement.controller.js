const User=require('../models/user.model');
const Mouvement=require('../models/mouvement.model');

exports.depot=(req,res,next)=>{
    User.findOne({_id:req.user._id}).then((user)=>{return res.render('depot',{user:user})}).catch(()=>{return res.redirect('/')})
}

exports.postDepot=(req,res)=>{

    if(req.body.montant<10){
        req.flash('error',"Le depot minimal est de 10 $");
        return res.redirect('/depot');
    }
    const mouvement=new Mouvement({
       montantDepot:req.body.montant,
       author:req.user
    })

    mouvement.save((err,mouvement)=>{
        if(err){
            req.flash('error',err.message);
        }
        User.findOne({_id:req.user._id},(err,user)=>{
            if(err){
                console.log(err);
            }
        user.montantsDepot.push(mouvement);
        user.current=user.current+mouvement.montantDepot;
        user.save();
        //console.log(user.current);
        })

        req.flash('success',"Votre depot a ete pris en compte");
        return res.redirect('/depot');
    })
}

exports.retrait=(req,res)=>{
    User.findOne({_id:req.user._id}).then((user)=>{res.render('retrait',{user:user})}).catch(()=>{return res.redirect('/')});
}

exports.postRetrait=(req,res)=>{

    if(req.body.montant<0){
        req.flash('error',"Le retrait doit etre > 0");
        return res.redirect('/retrait');
    }
    const mouvement=new Mouvement({
        montantRetrait:req.body.montant,
        author:req.user
    })

    mouvement.save((err,mouvement)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/retrait')
        }
        User.findOne({_id:req.user._id},(err,user)=>{
            if(err){
                console.log(err);
            }
            if(user.current<-50){
                req.flash('error',"You cannot proceed to withdraw money because your account is overdraft by 50$");
                return res.redirect('/retrait');
            }
            user.montantsRetrait.push(mouvement);
            user.current=user.current-mouvement.montantRetrait;
            user.save()
        })
        req.flash('success',"Votre retrait a bien ete pris en compte");
        return res.redirect('/retrait');
    })
}

