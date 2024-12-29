const Listing = require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
//index
module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

//addNew
module.exports.renderNewForm = (req,res)=>{
    
  res.render("./listings/add");
}
//showListings
module.exports.showListings = async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate({ path:"reviews",
  populate:{ path:"author"},})
  .populate("owner");
  if(!listing){
    req.flash("error","listing you want to searching for is deleted");
    res.redirect("/listings")
  }
  res.render("./listings/show",{listing})
}
//create
module.exports.createListings=async(req,res,next)=>{
   let response =   await geocodingClient.forwardGeocode({
    query: req.body.listings.location,
    limit: 1
  })
    .send()
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url,"..",filename);
  let newListings = new Listing(req.body.listings) ;
  newListings.owner = req.user._id;
  newListings.image = {url,filename};
  newListings.geometry = response.body.features[0].geometry;
  let savedListings = await newListings.save();
  console.log(savedListings);
  req.flash("success","listing created");
   res.redirect("/listings")
}
//renderEdit
module.exports.renderEdit = async(req,res)=>{
  let {id} = req.params;
  // console.log(id);
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","listing you want to edit has been deleted");
      res.redirect("/listings");
    }
    let orgImgUrl = listing.image.url;
    orgImgUrl = orgImgUrl.replace("/upload",("/upload/w_250"))
  res.render("./listings/edit.ejs",{listing,orgImgUrl});
}
//updateListings
module.exports.updateListings = async(req,res)=>{
  let {id} = req.params;
  let listings = await Listing.findByIdAndUpdate(id,{...req.body.listings});
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listings.image = {url,filename};
    await listings.save();
  }
  req.flash("success","listing updated!")
  res.redirect(`/listings/${id}`)
}
//delete listings
module.exports.destroyListings = async(req,res)=>{
  let {id} = req.params;
  const deletedItem = await Listing.findByIdAndDelete(id);
  console.log(deletedItem);
  req.flash("success","listing deleted!");
  res.redirect("/listings")
}