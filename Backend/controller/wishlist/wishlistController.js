const mongoose = require("mongoose");
const Wishlist = require("../../models/wishlist/wishlist");
const userModel = require("../../models/user")
const productModel = require("../../models/products/product")
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");


const addToWishlist = asyncHandler(async (req,res) => {

    const userId = req.user.id
   const productId = req.params.productId;
   if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(
            400,
            "Invalid Product ID"
        );
}

   const product = await productModel.findById(productId) 
   
   if(!product) {
    throw new ApiError(
            404,
            "product not found"
        );
   }

   const existingWishlist = await Wishlist.findOne({
    user:userId,
    product: productId
   })
   if(existingWishlist) {
    throw new ApiError(
            409,
            "product already in wishlist"
    );
   }

   const wishlistItem = await Wishlist.create({
    user:userId,
    product :productId
   })
   return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                wishlistItem,
                "successfully created wishlist"
            )
        );

});


const getWishlist = asyncHandler(async (req, res) => {
        const userId = req.user.id;

        const wishlist = await Wishlist.find({
            user: userId
        }).populate("product");

        if (wishlist.length === 0) {
            return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [],
                "Wishlist is empty"
            )
        );
           
        }


        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                wishlist,
                "Wishlist fetched successfully"
            )
        );

    })


const deleteWishlist = asyncHandler(async (req,res) => {
        const userId = req.user.id;
       
        
        const productId = req.params.productId;
         if (!mongoose.Types.ObjectId.isValid(productId)) {
             throw new ApiError(
            400,
            "Invalid productId"
    );
        }
        const wishlistItem = await Wishlist.findOneAndDelete({
            user:userId,
            product:productId
        })
        if(!wishlistItem) {
             throw new ApiError(
            404,
            "Item do not found"
    );
           
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                wishlistItem,
                "Wishlist item removed successfully"
            )
        );

    });
module.exports = {
    addToWishlist,getWishlist,deleteWishlist
}