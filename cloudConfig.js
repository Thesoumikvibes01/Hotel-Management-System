const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
//"https://res.cloudinary.com/dxylnktpb/image/upload/v1702318712/wanderlust_DEV/gayorhi9xts1rsjhw7oc.jpg"
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormat : ["png","jpg","jpeg"]
    },
});

module.exports = {
    cloudinary,
    storage
}