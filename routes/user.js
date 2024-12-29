const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware")
const userController = require("../controllers/user");

//renderSignUpForm && signUp
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));

//renderLoginForm && postLogin
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
  passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
  userController.login
 )

 //logout
router.get("/logout",userController.logOut);
module.exports = router;