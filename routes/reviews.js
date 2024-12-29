const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn,validateReview,isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");
//reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview))
 //review delete route
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))
 module.exports = router;