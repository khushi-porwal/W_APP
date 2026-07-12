const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        console.log("FILE =>", file);

        return {
            folder: "products",
            resource_type: "image"
        };
    }
});

const upload = multer({
    storage
});

module.exports = upload;