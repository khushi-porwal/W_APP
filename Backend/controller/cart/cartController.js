const mongoose = require("mongoose");

const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const Cart = require("../../models/carts/cart");
const productModel = require("../../models/products/product");


// ==========================================
// ADD PRODUCT TO CART
// ==========================================

const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const { productId } = req.params;

    const quantity =
        req.body.quantity === undefined
            ? 1
            : Number(req.body.quantity);

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(
            400,
            "Invalid Product ID"
        );
    }

    // Validate Quantity
    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {
        throw new ApiError(
            400,
            "Quantity must be a positive integer"
        );
    }

    // Find Product
    const product = await productModel.findById(
        productId
    );

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    // Check Product Stock
    if (product.stock <= 0) {
        throw new ApiError(
            400,
            "Product is out of stock"
        );
    }

    // Find Existing Cart Item
    const cartItem = await Cart.findOne({
        user: userId,
        product: productId,
    });

    // Product Already Exists In Cart
    if (cartItem) {
        const updatedQuantity =
            cartItem.quantity + quantity;

        if (updatedQuantity > product.stock) {
            throw new ApiError(
                400,
                `Only ${product.stock} items are available. You already have ${cartItem.quantity} in your cart`
            );
        }

        cartItem.quantity = updatedQuantity;

        await cartItem.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                cartItem,
                "Cart quantity increased"
            )
        );
    }

    // Validate New Cart Quantity
    if (quantity > product.stock) {
        throw new ApiError(
            400,
            `Only ${product.stock} items are available`
        );
    }

    // Create Cart Item
    const newCartItem = await Cart.create({
        user: userId,
        product: productId,
        quantity,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            newCartItem,
            "Product added to cart successfully"
        )
    );
});


// ==========================================
// GET USER CART
// ==========================================

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Get Cart Items With Product Details
    const cartItems = await Cart.find({
        user: userId,
    }).populate("product");

    // Find Invalid Cart Items
    // Product may have been deleted by admin
    const invalidCartItems = cartItems.filter(
        (item) => !item.product
    );

    // Delete Invalid Cart Items
    if (invalidCartItems.length > 0) {
        const invalidCartIds = invalidCartItems.map(
            (item) => item._id
        );

        await Cart.deleteMany({
            _id: {
                $in: invalidCartIds,
            },
        });
    }

    // Keep Only Valid Cart Items
    const validCartItems = cartItems.filter(
        (item) => item.product
    );

    // Cart Is Empty
    if (validCartItems.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    totalItems: 0,
                    totalAmount: 0,
                    cartItems: [],
                },
                "Cart is empty"
            )
        );
    }

    // Calculate Total Quantity
    const totalItems = validCartItems.reduce(
        (total, item) => {
            return total + item.quantity;
        },
        0
    );

    // Calculate Total Amount
    const totalAmount = validCartItems.reduce(
        (total, item) => {
            return (
                total +
                item.product.price *
                    item.quantity
            );
        },
        0
    );

    // Prepare Cart Data
    const cartData = {
        totalItems,
        totalAmount,
        cartItems: validCartItems,
    };

    // Send Response
    return res.status(200).json(
        new ApiResponse(
            200,
            cartData,
            "Cart fetched successfully"
        )
    );
});


// ==========================================
// DELETE CART ITEM
// ==========================================

const deleteCart = asyncHandler(async (req, res) => {
    const { cartId } = req.params;

    // Validate Cart ID
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new ApiError(
            400,
            "Invalid Cart ID"
        );
    }

    // Find And Delete User's Cart Item
    const cart = await Cart
        .findOneAndDelete({
            _id: cartId,
            user: req.user.id,
        })
        .populate("product");

    // Cart Item Not Found
    if (!cart) {
        throw new ApiError(
            404,
            "Cart item not found"
        );
    }

    // Send Response
    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart item deleted successfully"
        )
    );
});


// ==========================================
// UPDATE CART QUANTITY
// ==========================================

const updateCart = asyncHandler(async (req, res) => {
    const { cartId } = req.params;

    // Validate Cart ID
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new ApiError(
            400,
            "Invalid Cart ID"
        );
    }

    // Convert Quantity To Number
    const quantity = Number(req.body.quantity);

    // Validate Quantity
    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {
        throw new ApiError(
            400,
            "Quantity must be a positive integer"
        );
    }

    // Find User's Cart Item
    const cart = await Cart
        .findOne({
            _id: cartId,
            user: req.user.id,
        })
        .populate("product");

    // Cart Item Not Found
    if (!cart) {
        throw new ApiError(
            404,
            "Cart item not found"
        );
    }

    // Product Was Deleted
    if (!cart.product) {
        await Cart.findByIdAndDelete(cartId);

        throw new ApiError(
            404,
            "Product no longer exists"
        );
    }

    // Validate Product Stock
    if (quantity > cart.product.stock) {
        throw new ApiError(
            400,
            `Only ${cart.product.stock} items are available`
        );
    }

    // Update Quantity
    cart.quantity = quantity;

    await cart.save();

    // Send Response
    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart updated successfully"
        )
    );
});


module.exports = {
    addToCart,
    getCart,
    deleteCart,
    updateCart,
};