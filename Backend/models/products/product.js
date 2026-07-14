const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    price : {
        type : Number,
        required: true,
        min:0 //It prevents invalid data like negative prices from being stored in the database.
    },
    description : {
        type: String,
        required: true,
        trim:true // because descriptions can also contain unnecessary spaces.
    },
    category : {
        type: String,
        required: true
    },
    stock : {
        type: Number,
        required: true,
        default:0,
        min:0
    },
    image: {
    type: String,
    required: true
}
    
}, {
    timestamps :true
})

const productModel = mongoose.model("Product", productSchema)
module.exports = productModel










// Why store image URLs instead of image files?

// Answer:

// Images are uploaded to Cloudinary, which returns a URL.
//  We store the URL in MongoDB instead of the actual 
//  image because databases are not meant to store large 
//  binary files efficiently.