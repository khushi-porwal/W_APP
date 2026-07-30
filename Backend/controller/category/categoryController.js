const slugify = require("slugify");
const categoryModel = require("../models/category/category");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const addCategory = asyncHandler(async (req, res) => {

    // =========================
    // Get Request Data
    // =========================

    const { name, description } = req.body;

    // =========================
    // Validation
    // =========================

    if (!name || !name.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    // =========================
    // Trim Data
    // =========================

    const trimmedName = name.trim();
    const trimmedDescription = description?.trim() || "";

    // =========================
    // Check Duplicate Category
    // =========================

    const existingCategory = await categoryModel.findOne({
        name: trimmedName,
    });

    if (existingCategory) {
        throw new ApiError(400, "Category already exists");
    }

    // =========================
    // Image Upload
    // (Already uploaded by Multer + Cloudinary)
    // =========================

    let image = "";

    if (req.file) {
        image = req.file.path;
    }

    // =========================
    // Generate Slug
    // =========================

    const slug = slugify(trimmedName, {
        lower: true,
        strict: true,
    });

    // =========================
    // Create Category
    // =========================

    const category = await categoryModel.create({
        name: trimmedName,
        slug,
        description: trimmedDescription,
        image,
    });

    // =========================
    // Response
    // =========================

    return res.status(201).json(
        new ApiResponse(
            201,
            category,
            "Category created successfully"
        )
    );
});

module.exports = {
    addCategory,
};