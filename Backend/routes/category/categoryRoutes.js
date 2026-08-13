const express = require("express");
const router = express.Router();

const {
    addCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
} = require("../../controller/category/categoryController");

const upload = require("../../middleware/upload");
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

// ✅ PUBLIC - Storefront: home page, product filters use this
router.get(
    "/categories",
    getAllCategories
);

// 🔐 ADMIN ONLY - keeps the existing admin route working
router.post(
    "/add-category",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    addCategory
);

router.get(
    "/get-all-categories",
    authMiddleware,
    adminMiddleware,
    getAllCategories
);

router.put(
    "/update-category/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    updateCategory
);

router.delete(
    "/delete-category/:id",
    authMiddleware,
    adminMiddleware,
    deleteCategory
);

module.exports = router;