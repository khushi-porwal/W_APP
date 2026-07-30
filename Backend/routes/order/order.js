const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../../middleware/authMiddleware"
);
const adminMiddleware = require(
    "../../middleware/adminMiddleware"
)
const {
    placeOrder,
    getMyOrder,
    getSingleOrder,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    getAdminSingleOrder
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

// router.put(
//     "/update-order/:orderId/status",
//     authMiddleware,
//     adminMiddleware,
//     updateOrderStatus
// );


router.put(
    "/admin/orders/:orderId/status",
    authMiddleware,
    adminMiddleware,
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

router.get(
    "/admin/orders",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);

router.get(
    "/admin/orders/:orderId",
    authMiddleware,
    adminMiddleware,
    getAdminSingleOrder
)
module.exports = router;