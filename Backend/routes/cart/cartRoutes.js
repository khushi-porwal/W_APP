const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware")
const {addToCart, getCart, deleteCart, updateCart} = require("../../controller/cart/cartController")
router.post ("/add-To-Cart/:productId", authMiddleware, addToCart)
router.get("/getCart", authMiddleware, getCart)
router.delete("/delete-cart/:cartId", deleteCart)
router.put("/update-cart/:cartId", updateCart)
module.exports = router;