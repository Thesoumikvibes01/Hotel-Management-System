const Listing = require("./models/listings");
const Review = require("./models/reviews");
const ExpressErr = require("./utils/ExpressError");
const {listSchema} = require("./schema");
const {reviewSchema} = require("./schema");
//isLoggedIn
module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
      console.log(req.originalUrl)
        req.session.redirectUrl = req.originalUrl
        req.flash("error","you need to logged in to create listings");
      return  res.redirect("/login");
    }else{
        next();
    }
}
//redirectUrl
module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
//isOwner
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id);
    if(!listings.owner.equals(res.locals.curUser._id)){
      req.flash("error","you are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
//isReviewAuthor
module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.curUser._id)){
    req.flash("error","you are not the owner of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
//listings validate
module.exports.validateListings=(req,res,next)=>{
    let {error} = listSchema.validate(req.body);
      // console.log(result);
      if(error){
        // console.log(error.details)
        const errMsg = error.details.map((el)=>el.message)
        throw new ExpressErr(400,errMsg)
      }else{
        next()
      }
    
}
//reviews validate
module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    
    if(error){
      const errMsg = error.details.map((el)=>el.message)
       throw new ExpressErr("400",errMsg);
    }else{
      next();
    }
}