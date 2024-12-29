const express = require("express");
const router = express.Router();
const Listing = require("../models/listings")
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListings} = require("../middleware")
const listingController = require("../controllers/listings");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({storage});
//index && create route
  router.route("/")
   .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single("listings[image]"),validateListings,wrapAsync(listingController.createListings))
  
  //add route
  router.get("/add",isLoggedIn,listingController.renderNewForm)
  //show && update && delete route
  router.route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(isLoggedIn,isOwner,upload.single("listings[image]"),validateListings,wrapAsync(listingController.updateListings))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListings));
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEdit))
module.exports = router;