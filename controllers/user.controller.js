const User = require("../models/user.model");
const passport=require('passport');
const Mouvement = require("../models/mouvement.model");
const Reset = require("../models/reset.model");
const randomToken=require('random-token');

exports.signup=(req,res)=>{

    const user=new User({
        username:req.body.username,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
    })

    User.register(user,req.body.password,(err,user)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/users/signup');
        }

            req.flash('success',"Vous etes enregistre !");
            return res.redirect('/users/login');
        })
    
}

exports.login=(req,res)=>{
    const user=new User({
        username:req.body.username,
        password:req.body.password
    })

    req.login(user,(err)=>{
        if(err){
            req.flash('error',"Unable to login");
            return res.redirect('/users/login')
        }

        passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid username or password'})(req,res,(err,user)=>{
            if(err){
                req.flash('error',err.message);
                return res.redirect('/users/login');
            }

            req.flash('success',"Vous etes connecte");
            return res.redirect('/');
        })
    })
}
exports.comptes=(req,res)=>{
    User.findOne({_id:req.user._id},(err,user)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/users/comptes')
        }
    Mouvement.find({author:req.user._id},(err,mouvements)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/users/comptes');
        }
   

    return res.render('comptes',{mouvements:mouvements,user:user});

})
    
    })
}

exports.forgot=(req,res,next)=>{
    User.findOne({username:req.body.username},(err,user)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/users/forgot-password');
        }
        if(!user){
            req.flash('error',"User not found");
            return res.redirect('/users/forgot-password');
        }

        const token=randomToken(32);
        const reset=new Reset({
            username:req.body.username,
            resetPasswordToken:token,
            resetExpires:Date.now()+3600000
        })

        reset.save((err,reset)=>{
            if(err){
                req.flash('error',"Ray");
                return res.redirect('/users/forgot-password');
            }

        
            req.body.email=user.email;
            req.body.message="Hello "+user.firstname+" click the following link to reset your password : <br>"+req.protocol+"://"+req.get('host')+"/users/reset-password/"+token;
            next();
        })
    })
}

exports.reset=(req,res)=>{
    const token = req.params.token;
    Reset.findOne({resetPasswordToken:token,resetExpires:{$gt:Date.now()}},(err,reset)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/users/reset-password/'+token);
        }
        if(!reset){
            req.flash('error',"Invalid token");
            return res.redirect('/users/reset-password/'+token);

        }

        req.flash('success',"Redefinissez votre mot de passe")
        return res.render('reset-password');
    })
}

exports.resetPost=(req,res)=>{
    const token=req.params.token;
    const password=req.body.password;
    Reset.findOne({resetPasswordToken:token,resetExpires:{$gt:Date.now()}},(err,reset)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/users/reset-password/'+token);
        }
        if(!reset){
            req.flash('error',"Invalid token");
            return res.redirect('/users/reset-password/'+token);

        }
        User.findOne({username:reset.username},(err,user)=>{
            if(err){
                req.flash('error',err.message);
            return res.redirect('/users/reset-password/'+token);
            }
            if(!user){
                req.flash('error',"User not found");
                return res.redirect('/users/reset-password/'+token);
            }

            user.setPassword(password,(err)=>{
                if(err){
                    req.flash('error',"You cannot change your password");
                return res.redirect('/users/reset-password/'+token);
                }
            
                user.save();
                        //On supprime tous les tokens :
                        Reset.deleteMany({username:user.username},(err,message)=>{
                            if(err){
                                console.log(err)
                            }
                            console.log(message);
                        })

                        req.flash("success","Your password has been updated. You can now login");
                        return res.redirect("/users/login");

            })
        })
    })
}

exports.profilPost=(req,res)=>{
    User.findOne({_id:req.user._id},(err,user)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/');
        }
        if(!user){
            req.flash('error',err.message);
            return res.redirect('/');
        }

        user.username=req.body.username?req.body.username:user.username;
        user.firstname=req.body.firstname?req.body.firstname:user.firstname;
        user.lastname=req.body.lastname?req.body.lastname:user.lastname;
        user.email=req.body.email?req.body.email:user.email;

        user.save((err,user)=>{
            if(err){
                req.flash('error',"Error in user saving");
                return res.redirect('/')
            }

            req.flash('success',"Vous avez bien mis a jour votre profile bancaire");
            return res.redirect('/');
        })
    })
}

exports.search=(req,res)=>{
    if(req.body.search == "Compte"||req.body.search == "compte"){
        req.flash('success',"Vous pouvez acceder a vos comptes");
        return res.redirect('/users/comptes');

    }else if(req.body.search == "Depot"||req.body.search == "depot"){
        req.flash('success',"Vous pouvez effectuer un depot");
        return res.redirect('/depot');

    }else if(req.body.search == "retrait"||req.body.search=="Retrait"){
        req.flash('success',"Vous pouvez effectuer un retrait");
        return res.redirect('/retrait');
    }else{
        req.flash('error',"Vous ne pouvez rechercher que les mots : Compte, Depot ou Retrait");
        return res.redirect('/');
    }

}