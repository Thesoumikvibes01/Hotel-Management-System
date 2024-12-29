const mongoose = require("mongoose");
const Listing = require("../models/listings");
const initData = require("./data");
main()
.then((res)=>{
    console.log("connection successfull");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

const initDb = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"656a01df87bd4f3f26267e08"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}
initDb();
