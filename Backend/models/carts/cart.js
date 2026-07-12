const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default:1,
        min:1
    }
}, {timestamps: true})


// Prevent duplicate products in the same user's cart
cartSchema.index(
    {
        user: 1,
        product: 1
    },
    {
        unique: true
    }
);
const cartModel = mongoose.model("Cart", cartSchema)
module.exports = cartModel


// Why are user and product stored as ObjectId instead of strings?

// Answer

// Because MongoDB uses ObjectId to create relationships 
// between collections. Using ref allows us to 
// use populate() to fetch complete user or product details.







// Why use populate()?

// Answer

// Suppose Cart document is

// {
//     product: "68784..."
// }

// Without populate()

// you only get

// 68784...

// With

// .populate("product")

// you get

// {
//     name: "iPhone",
//     price: 80000,
//     images:[...]
// }

// Much more useful for the frontend.






// Why did you create a separate Cart collection instead of 
// storing the cart inside the User document?

// Strong Answer

// I chose a separate Cart collection because cart items 
// can grow independently of the user document. This keeps 
// the User document small, makes cart operations easier 
// to manage, and allows efficient querying and updates 
// without modifying the entire user document.