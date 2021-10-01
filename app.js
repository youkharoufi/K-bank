var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const User=require('./models/user.model');
const Mouvement=require('./models/mouvement.model');
const dotenv=require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false,
  //cookie:{secure:true}
}));

//Connection a la BDD Mongodb
mongoose.connect(process.env.DATABASE,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{console.log("Connection to database succeded")}).catch(()=>{console.log("Connection to database error")});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Passport :
app.use(require('body-parser').urlencoded({ extended: true }));

//Init passport (apres session)
app.use(passport.initialize());
app.use(passport.session());

//passport local mongoose
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  if(req.user){
    Mouvement.find({author:req.user._id},(err,mouvements)=>{
      if(err){
        console.log(err.message);
      }else{
        console.log(mouvements);
      res.locals.mouvements=mouvements;
    }
    next();
  })
    
 }else{
   next();
 }
})

//Init flash
app.use(flash());



app.use((req,res,next)=>{
if(req.user){
  res.locals.user=req.user;
}
  res.locals.errorForm=req.flash('errorForm');
  res.locals.error=req.flash('error');
  res.locals.warning=req.flash('warning');
  res.locals.success=req.flash('success');
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
