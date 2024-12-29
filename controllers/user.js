const User = require("../models/user");
//render SignUp Form
module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signUp.ejs");
}
//post signUp
module.exports.signUp = async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
       let regUser = await User.register(newUser,password);
    //    console.log(regUser);
        req.logIn(regUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","welcome to the wanderlust!");
            res.redirect("/listings");
        })
       
    } catch (err) {
        req.flash("error",err.message)
        res.redirect("/signup");
    }
    
}
//getLoginForm
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login");
}
//login
module.exports.login = async(req,res)=>{
    // if(res.locals.redirectUrl = "/listings/656dcfb87845f018f5b96314/reviews/6570d5f15ed130271a031412?_method=delete"){
    //    return res.redirect("/listings/:id/reviews/:reviewId")
    // }
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
    console.log(req.user)
}
//logOut
module.exports.logOut = (req,res)=>{
    
    req.logOut((err)=>{
        if(err){
          return  next(err)
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
        // console.log(req.user)
    })
}