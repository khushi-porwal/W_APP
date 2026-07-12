const express = require('express');
const { addToWishlist, getWishlist, deleteWishlist } = require('../../controller/wishlist/wishlistController');
const router = express.Router();

router.post("/add-to-wishlist/:productId",addToWishlist)
router.get("/get-wishlist",getWishlist)
router.delete("remove-from-wishlist/:productId", deleteWishlist)

module.exports = router;