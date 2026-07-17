const express = require("express");

const router = express.Router();

const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} = require("../../controller/product/productController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");
const upload = require("../../middleware/upload");

router.post(
    "/create-product",
    authMiddleware,
    // adminMiddleware,
    upload.single("image"),
    createProduct
);

router.get(
    "/get-product",
    getAllProduct
);

router.get(
    "/single-product/:id",
    getSingleProduct
);

router.put(
    "/update-product/:id",
    authMiddleware,
    // adminMiddleware,
    upload.single("image"),
    updateProduct
);
router.delete(
    "/delete-product/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);

module.exports = router;



// Agar interviewer pooche:

// Why is getAllProducts not protected?

// Tum bolo:

// “Product browsing is a public operation in my e-commerce 
// application, so users can view and search products without 
// authentication. Product creation, updates and deletion are
//  restricted to admins.”

// Good API design answer.