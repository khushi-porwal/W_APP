const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const userModel = require("../../models/user")
const mongoose = require("mongoose");
const productModel = require("../../models/products/product")
const Review = require("../../models/review/review")
const orderModel = require("../../models/order/Order")
const updateProductRating = require("../../utils/updatePProductRating")

const addReview = asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const productId = req.params.productId;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new ApiError(
            400,
            "Invalid Product ID"
        );
        }
        const product = await productModel.findById(productId);
        if (!product) {
            throw new ApiError(
            404,
            "Product not found"
        );
        }

        const { rating, comment } = req.body;

        if (rating === undefined || !comment?.trim()) {
            throw new ApiError(
            400,
           "Rating and comment are required"
        );
        }

        if (!Number.isInteger(rating)||rating < 1 || rating > 5) {
            throw new ApiError(
            400,
            "Rating must be between 1 and 5"
        );
           
        }

        // User must have purchased and received the product
        const purchasedOrder = await orderModel.findOne({
            user: userId,
            paymentStatus: "Paid",
            status: "Delivered",
            "items.product": productId
        });

        if (!purchasedOrder) {
            throw new ApiError(
            403,
            "You can review only purchased and delivered products"
        );
           
        }

        // One review per product per user
        const existingReview = await Review.findOne({
            user: userId,
            product: productId
        });

        if (existingReview) {
            throw new ApiError(
            409,
            "you already reviewed this product"
        );
           
        }

        // Create Review
        const review = await Review.create({
            user: userId,
            product: productId,
            rating,
            comment
        });

        // ===============================
        // Update Product Average Rating
        // ===============================

        await updateProductRating(productId);

         return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                review,
                "Review added successfully"
            )
        );

    });
const getReviews = asyncHandler(async (req, res) => {

    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(
            400,
            "Invalid Product ID"
        );
    }

    const product = await productModel.findById(productId);

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    const reviews = await Review.find({
        product: productId
    }).populate("user", "name");

    if (reviews.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        averageRating: 0,
                        totalReviews: 0,
                        data: []
                    },
                    "No reviews available"
                )
            );
    }

    let averageRating = 0;

    for (const item of reviews) {
        averageRating += item.rating;
    }

    averageRating = Number(
        (averageRating / reviews.length).toFixed(1)
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    averageRating,
                    totalReviews: reviews.length,
                    data: reviews
                },
                "Reviews fetched successfully"
            )
        );
}); 

const deleteReview = asyncHandler(async (req, res) => {

    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    // Validate Review ID
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ApiError(
            400,
            "Invalid Review ID"
        );
    }

    // Find Review
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(
            404,
            "Review not found"
        );
    }

    // Check Ownership
    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(
            403,
            "You can delete only your own review"
        );
    }

    // Store Product ID before deleting
    const productId = review.product;

    // Delete Review
    await Review.findByIdAndDelete(reviewId);

    // Update Product Rating
    await updateProductRating(productId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Review deleted successfully"
            )
        );
});



// const AverageRating = async(req,res) => {
//     try {
//         const productId = req.params.productId;
//         const product = await productModel.findById(productId);

//         if(!product) {
//             return res.status(404).json({
//                 success:false,
//                 message:"product do not found"
//             })
//         }
       

//         const review = await Review.find({
//             product:productId
//         })

//         if(review.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 averageRating: 0,
//                 totalReviews: 0
//             });
//         }

//         let totalRating = 0;

//         for(let item of review) {
//             totalRating += item.rating;
//         }

//         const averageRating = totalRating/review.length;
        
//         return res.status(200).json({
//             success: true,
//             averageRating,
//             totalReviews: review.length
//         });

//     } catch(err) {
//         console.log(err)
//         return res.status(500).json({
//             success:false,
//             message: "something went wrong average rating"
//         })
//     }
// }



const updateReview = asyncHandler(async (req, res) => {

    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    // Validate Review ID
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ApiError(
            400,
            "Invalid Review ID"
        );
    }

    // Find Review
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(
            404,
            "Review not found"
        );
    }

    // Check Ownership
    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(
            403,
            "You can update only your own review"
        );
    }

    const { rating, comment } = req.body;

    // Validation
    if (rating === undefined || !comment?.trim()) {
        throw new ApiError(
            400,
            "Rating and comment are required"
        );
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(
            400,
            "Rating must be between 1 and 5"
        );
    }

    // Update Review
    review.rating = rating;
    review.comment = comment.trim();

    await review.save();

    // Update Product Average Rating
    await updateProductRating(review.product);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                review,
                "Review updated successfully"
            )
        );
});

module.exports= {
    addReview,getReviews,deleteReview,updateReview
}