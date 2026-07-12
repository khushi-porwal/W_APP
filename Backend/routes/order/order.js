const express = require("express")
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware")
const {placeOrder, getMyOrder, getSingleOrder, updateOrderStatus, cancelOrder} = require("../../controller/order/PlaceOrder")

router.post("/create-order", authMiddleware, placeOrder)
router.get("/get-my-order", authMiddleware, getMyOrder)
router.get("/get-single-order/:orderId",getSingleOrder)
router.put("/update-order/:orderId/status", updateOrderStatus)
router.delete("/cancel-order/:orderId",cancelOrder)
module.exports = router