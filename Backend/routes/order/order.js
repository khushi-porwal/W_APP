const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../../middleware/authMiddleware"
);

const adminMiddleware = require(
    "../../middleware/adminMiddleware"
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


router.post(
    "/place-order",
    authMiddleware,
    placeOrder
);

router.get(
    "/get-my-order",
    authMiddleware,
    getMyOrder
);

router.get(
    "/get-single-order/:orderId",
    authMiddleware,
    getSingleOrder
);

router.put(
    "/update-order/:orderId/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);

router.delete(
    "/cancel-order/:orderId",
    authMiddleware,
    cancelOrder
);


module.exports = router;