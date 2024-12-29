if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ExpressErr = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
let port = 8080;
const dbUrl = process.env.ATLASDB_URL;
main()
.then((res)=>{
  console.log("Connection successfull");
})
.catch((err)=>{ 
  console.log(err);
})
async function main(){
  //  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  await mongoose.connect(dbUrl);
}
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
const listingsRoute = require("./routes/listings");
const reviewsRoute = require("./routes/reviews");
const userRoute = require("./routes/user");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: "mysecretsupercode"
  },
  touchAfter: 24 * 3600
})
store.on("error",(err)=>{
  console.log("error occured in MONGO SESSION STORE",err)
})
const sessionOptions = {
    store:store,
    secret:"mysecretsupercode",
    resave:true,
    saveUninitialized: true,
    // cookie:{
    //   expires:Date.now()+7*24*60*60*1000,
    //   maxAge:24*7*60*60*1000,
    //   httpOnly:true
    // }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()) );
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.get("/",(req,res)=>{
//     res.send("response from root");
// })

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user;
  next()
})
// app.get("/demouser",async(req,res)=>{
//    const addUser = new User({
//      email:"Soumiknath@gmail.com",
//      username:"Soumik"
//    })
//    let regUser = await  User.register(addUser,"soumik123");
//   res.send(regUser)
// })
app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);


app.all("*",(req,res,next)=>{
    next(new ExpressErr(404,"page not found")) ;
    //throw new ExpressErr(404,"page not found")
})
app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});
  //  res.status(statusCode).send(message);
})

app.listen(port,()=>{
    console.log(`app listen on port ${port}`);
})