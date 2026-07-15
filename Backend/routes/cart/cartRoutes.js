const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../../middleware/authMiddleware"
);

const {
    addToCart,
    getCart,
    deleteCart,
    updateCart,
} = require(
    "../../controller/cart/cartController"
);

router.post(
    "/cart/:productId",
    authMiddleware,
    addToCart
);

router.get(
    "/cart",
    authMiddleware,
    getCart
);

router.delete(
    "/cart/:cartId",
    authMiddleware,
    deleteCart
);

router.put(
    "/cart/:cartId",
    authMiddleware,
    updateCart
);
module.exports = router;