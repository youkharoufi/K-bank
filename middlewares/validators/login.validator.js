const {Validator}=require('node-input-validator');

const loginValidator=(req,res,next)=>{

    const v=new Validator({
        username:'required',
        password:'required',
    })

    v.check().then((matched)=>{
        if(!matched){
            req.flash('errorForm',v.errors);
            return res.redirect('/users/login');
        }
        next();
    })
}

module.exports=loginValidator;