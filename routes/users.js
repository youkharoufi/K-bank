var express = require('express');
var router = express.Router();
const userController=require('../controllers/user.controller');
const signupValidator=require('../middlewares/validators/signup.validator');
const loginValidator=require('../middlewares/validators/login.validator');
const emailService=require('../middlewares/services/email.service');
const {guard}=require('../middlewares/guard');

/* GET users listing. */
router.get('/login', (req,res)=>{
  res.render('login');
});

router.get('/signup',(req,res)=>{
  res.render('signup');
})

router.post('/signup',signupValidator, userController.signup);

router.post('/login',loginValidator, userController.login);

router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success','You are now disconnected !');
  res.redirect('/');
});

router.get('/comptes',guard,userController.comptes);

router.get('/forgot-password',(req,res)=>{
   res.render('forgot-password');
});

router.post('/forgot-password',userController.forgot,emailService);

router.get('/reset-password/:token',userController.reset);

router.post('/reset-password/:token',userController.resetPost);

router.get('/post',(req,res)=>{
  return res.render('profil');
});

router.post('/post', guard, userController.profilPost);

router.post('/search',userController.search);

module.exports = router;
