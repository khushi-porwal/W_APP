const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../../middleware/authMiddleware"
);

const {
    placeOrder,
    getMyOrder,
    getSingleOrder,
    updateOrderStatus,
    cancelOrder,
} = require(
    "../../controller/order/PlaceOrder"
);


// ==========================================
// PLACE ORDER
// ==========================================

router.post(
    "/place-order",
    authMiddleware,
    placeOrder
);


// ==========================================
// GET MY ORDERS
// ==========================================

router.get(
    "/get-my-order",
    authMiddleware,
    getMyOrder
);


// ==========================================
// GET SINGLE ORDER
// ==========================================

router.get(
    "/get-single-order/:orderId",
    authMiddleware,
    getSingleOrder
);


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.put(
    "/update-order/:orderId/status",
    authMiddleware,
    updateOrderStatus
);


// ==========================================
// CANCEL ORDER
// ==========================================

router.delete(
    "/cancel-order/:orderId",
    authMiddleware,
    cancelOrder
);


module.exports = router;