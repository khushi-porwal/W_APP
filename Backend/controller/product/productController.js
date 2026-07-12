const productModel = require("../../models/products/product")
const mongoose = require("mongoose");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");


const createProduct = asyncHandler(async (req, res) => {

    const {
        name,
        price,
        description,
        category,
        stock
    } = req.body;

    // Validate Required Fields
    if (
        !name?.trim() ||
        price === undefined ||
        !description?.trim() ||
        !category ||
        stock === undefined
    ) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    // Validate Image
    if (!req.file) {
        throw new ApiError(
            400,
            "Image is required"
        );
    }

    const images = [req.file.path];

    // Check Existing Product
    const existingProduct = await productModel.findOne({
        name
    });

    if (existingProduct) {
        throw new ApiError(
            409,
            "Product already exists"
        );
    }

    // Validate Price
    if (isNaN(price) || Number(price) <= 0) {
        throw new ApiError(
            400,
            "Price must be greater than 0"
        );
    }

    // Validate Stock
    if (isNaN(stock) || Number(stock) < 0) {
        throw new ApiError(
            400,
            "Stock cannot be negative"
        );
    }

    // Create Product
    const newProduct = await productModel.create({
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        category,
        stock: Number(stock),
        images
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newProduct,
                "Product created successfully"
            )
        );
});


const getAllProduct = asyncHandler(async (req, res) => {

    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const category = req.query.category || "";
    const sort = req.query.sort;

    // Validate Pagination
    if (page < 1 || limit < 1) {
        throw new ApiError(
            400,
            "Page and limit must be greater than 0"
        );
    }

    const skip = (page - 1) * limit;

    // Build Filter
    const searchFilter = {};

    if (search) {
        searchFilter.name = {
            $regex: search,
            $options: "i"
        };
    }

    if (category) {
        searchFilter.category = category;
    }

    // Build Query
    let query = productModel.find(searchFilter);

    // Sorting
    if (sort === "lowToHigh") {
        query = query.sort({
            price: 1
        });
    }
    else if (sort === "highToLow") {
        query = query.sort({
            price: -1
        });
    }

    // Fetch Products
    const products = await query
        .skip(skip)
        .limit(limit);

    // Count Total Products
    const totalProducts = await productModel.countDocuments(
        searchFilter
    );

    const totalPages = Math.ceil(
        totalProducts / limit
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    products
                },
                products.length === 0
                    ? "No products found"
                    : "Products fetched successfully"
            )
        );
});


const getSingleProduct = asyncHandler(async (req, res) => {

    const id = req.params.id;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(
            400,
            "Invalid Product ID"
        );
    }

    // Find Product
    const product = await productModel.findById(id);

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Product fetched successfully"
            )
        );
});



const updateProduct = asyncHandler(async (req, res) => {

    const productId = req.params.id;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(
            400,
            "Invalid Product ID"
        );
    }

    const {
        price,
        stock,
        description,
        category,
        name
    } = req.body;

    // Validate Price
    if (
        price !== undefined &&
        (isNaN(price) || Number(price) < 0)
    ) {
        throw new ApiError(
            400,
            "Price cannot be negative"
        );
    }

    // Validate Stock
    if (
        stock !== undefined &&
        (isNaN(stock) || Number(stock) < 0)
    ) {
        throw new ApiError(
            400,
            "Stock cannot be negative"
        );
    }

    // Create Update Object
    const updateData = {};

    if (name !== undefined) {
        updateData.name = name.trim();
    }

    if (price !== undefined) {
        updateData.price = Number(price);
    }

    if (stock !== undefined) {
        updateData.stock = Number(stock);
    }

    if (description !== undefined) {
        updateData.description = description.trim();
    }

    if (category !== undefined) {
        updateData.category = category;
    }

    // Update Image
    if (req.file) {
        updateData.images = [req.file.path];
    }

    // Update Product
    const product = await productModel.findByIdAndUpdate(
        productId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Product updated successfully"
            )
        );
});



const deleteProduct = asyncHandler(async (req, res) => {

    const productId = req.params.id;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(
            400,
            "Invalid Product ID"
        );
    }

    // Delete Product
    const product = await productModel.findByIdAndDelete(
        productId
    );

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Product deleted successfully"
            )
        );
});

module.exports =  {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct
}



// Why use isNaN()?

// Answer:

// Because data from req.body may not always be numeric. 
// isNaN() ensures that values like "abc" are rejected 
// before saving them to the database.






// Why convert page using Number()?

// Because

// req.query.page

// always comes as a string.

// Example

// ?page=2

// becomes

// "2"

// Using

// Number(req.query.page)

// converts it into

// 2

// which is required for calculations.





// Why use Regex?

// Answer:

// Regex allows partial matching.

// Example

// Searching

// iphone

// matches

// iPhone 16 Pro



// Why use skip?

// Answer:

// Skip ignores previous documents so MongoDB 
// returns only the requested page.


