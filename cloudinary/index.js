const cloudinary = require('cloudinary').v2;
// to configure the Cloudinary object w/ the private credentials (so it will connect w/ the storage)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const { CloudinaryStorage } = require('multer-storage-cloudinary');
// to create & configure a storage instance w/ specific parameters
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'jpg', 'png']
    }
})

module.exports = { cloudinary, storage }