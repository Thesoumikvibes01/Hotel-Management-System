const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");
const listSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        // required:true
    },
    image:{
    //     type:String,
    //     default:"https://images.wallpaperscraft.com/image/single/ocean_horizon_sunset_135214_1280x720.jpg",
    //     set:(v)=>v===""?"https://images.wallpaperscraft.com/image/single/ocean_horizon_sunset_135214_1280x720.jpg":v,
       url:String,
       filename:String
    },
    price:{
        type:Number,
        // required:true
    },
    location:{
        type:String,
        // required:true
    },
    country:{
        type:String,
        // required:true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
})
listSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id:{$in:listing.reviews}})
})
const Listing = mongoose.model("Listing",listSchema);
module.exports=Listing;