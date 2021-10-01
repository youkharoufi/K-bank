exports.guard=(req,res,next)=>{

    if(!req.user){
        req.flash('warning',"Vous devez etre connecte pour acceder a cette fonctionnalite");
        return res.redirect('/users/login');
    }
    next();
}

