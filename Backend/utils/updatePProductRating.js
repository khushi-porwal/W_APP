const mongoose = require("mongoose");
const Review = require("../models/review/review");
const productModel = require("../models/products/product");

const updateProductRating = async (productId) => {

    const ratingResult = await Review.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(productId)
            }
        },
        {
            $group: {
                _id: null,
                averageRating: {
                    $avg: "$rating"
                },
                totalReviews: {
                    $sum: 1
                }
            }
        }
    ]);

    if (ratingResult.length > 0) {

        await productModel.findByIdAndUpdate(
            productId,
            {
                averageRating: Number(
                    ratingResult[0].averageRating.toFixed(1)
                ),
                numReviews: ratingResult[0].totalReviews
            }
        );

    } else {

        await productModel.findByIdAndUpdate(
            productId,
            {
                averageRating: 0,
                numReviews: 0
            }
        );

    }

};

module.exports = updateProductRating;