const express = require("express")
const router = express.Router();
const {createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct} = require("../../controller/product/productController");
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");
const upload = require("../../middleware/upload");


router.post(
    "/create-product",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    createProduct
);
router.get("/get-product", authMiddleware, adminMiddleware, getAllProduct)
router.get("/single-product/:id", authMiddleware, adminMiddleware, getSingleProduct)
router.put("/update-product/:id", authMiddleware, adminMiddleware, updateProduct)
router.delete("/delete-product/:id", authMiddleware, adminMiddleware, deleteProduct)
module.exports = router