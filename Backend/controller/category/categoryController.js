const slugify = require("slugify");
const categoryModel = require("../../models/category/category")
const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

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

const getAllCategories = asyncHandler(async (req, res) => {

    // =========================
    // Get Query Parameters
    // =========================

    const {
        search = "",
        page = 1,
        limit = 5,
    } = req.query;

    // =========================
    // Build Search Filter
    // =========================

    const filter = {

        name: {
            $regex: search,
            $options: "i",
        },

    };

    // =========================
    // Count Total Categories
    // =========================

    const totalCategories = await categoryModel.countDocuments(filter);

    // =========================
    // Get Categories
    // =========================

    const categories = await categoryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    // =========================
    // No Categories Found
    // =========================

    if (categories.length === 0) {

        return res.status(200).json(

            new ApiResponse(

                200,

                {
                    totalCategories: 0,
                    totalPages: 0,
                    currentPage: Number(page),
                    categories: [],
                },

                "No categories found"

            )

        );

    }

    // =========================
    // Prepare Response
    // =========================

    const categoryData = {

        totalCategories,

        totalPages: Math.ceil(totalCategories / limit),

        currentPage: Number(page),

        categories,

    };

    // =========================
    // Send Response
    // =========================

    return res.status(200).json(

        new ApiResponse(

            200,

            categoryData,

            "Categories fetched successfully"

        )

    );

});

const updateCategory = asyncHandler(async (req, res) => {

    // =========================
    // Get Category ID
    // =========================

    const { id } = req.params;

    // =========================
    // Get Request Data
    // =========================

    const { name, description, isActive } = req.body;

    // =========================
    // Find Category
    // =========================

    const category = await categoryModel.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // =========================
    // Duplicate Name Check
    // =========================

    if (name && name.trim() !== category.name) {

        const existingCategory = await categoryModel.findOne({
            name: name.trim(),
            _id: { $ne: id },
        });

        if (existingCategory) {
            throw new ApiError(400, "Category already exists");
        }

        category.name = name.trim();

        category.slug = slugify(name, {
            lower: true,
            strict: true,
        });
    }

    // =========================
    // Update Description
    // =========================

    if (description !== undefined) {
        category.description = description.trim();
    }

    // =========================
    // Update Status
    // =========================

    if (isActive !== undefined) {
        category.isActive = isActive;
    }

    // =========================
    // Update Image
    // =========================

    if (req.file) {
        category.image = req.file.path;
    }

    // =========================
    // Save
    // =========================

    await category.save();

    // =========================
    // Response
    // =========================

    return res.status(200).json(

        new ApiResponse(

            200,

            category,

            "Category updated successfully"

        )

    );

});

const deleteCategory = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const category = await categoryModel.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    await category.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Category deleted successfully"
        )
    );

});


module.exports = {
    addCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};