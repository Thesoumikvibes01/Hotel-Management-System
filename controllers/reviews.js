const Listing = require("../models/listings");
const Review = require("../models/reviews");
//postReview
module.exports.postReview = async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let newReview =  new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success","review added!")
    res.redirect(`/listings/${listings._id}`)
 }
 //destroyReview
 module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!")
    res.redirect(`/listings/${id}`);
}