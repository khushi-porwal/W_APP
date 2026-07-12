const express = require("express")
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware")
const adminMiddleware = require("../../middleware/adminMiddleware")
const {getAllOrder, updateOrderStatus, getAllUser, getDashboardStats, getTopSellingProducts, getTopCategory, getLowStockProducts, getRecentOrder, getOrderByStatus, getBestCustomer} = require("../../controller/admin/adminController")

router.get("/get-all-order",authMiddleware ,adminMiddleware, getAllOrder)
router.put("/update-admin-order/:id/status",authMiddleware, adminMiddleware, updateOrderStatus)
router.get("/get-all-users", authMiddleware, adminMiddleware, getAllUser)
router.get("/dashboard-stats", authMiddleware, adminMiddleware, getDashboardStats)
router.get("/top-selling-products", authMiddleware, adminMiddleware,getTopSellingProducts)
router.get("/top-category", authMiddleware, adminMiddleware, getTopCategory)
router.get("/low-stock-products", authMiddleware, adminMiddleware, getLowStockProducts)
router.get("/get-Recent-Order",authMiddleware, adminMiddleware, getRecentOrder)
router.get("/get-order-status",authMiddleware, adminMiddleware, getOrderByStatus)
router.get("/get-customers", authMiddleware, adminMiddleware, getBestCustomer)
module.exports = router