const express = require("express");
const router = express.Router();

const { addCategory } = require("../../controller/category/categoryController");

const upload = require("../../middleware/upload");
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

router.post(
    "/add-category",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    addCategory
);

module.exports = router;