const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const cartModel = require("../../models/carts/cart");
const Cart = require("../../models/carts/cart");
const productModel = require("../../models/products/product");
const userModel = require("../../models/user");


const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  // =========================
  // Validate Product ID
  // =========================

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(
      400,
      "Invalid Product ID"
    );
  }

  // =========================
  // Find Product
  // =========================

  const product = await productModel.findById(productId);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }

  // =========================
  // Find Cart Item
  // =========================

  const cartItem = await Cart.findOne({
    user: userId,
    product: productId,
  });

  // =========================
  // Increase Cart Quantity
  // =========================

  if (cartItem) {
    if (cartItem.quantity >= product.stock) {
      throw new ApiError(
        400,
        "Product is out of stock"
      );
    }

    cartItem.quantity += 1;

    await cartItem.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cartItem,
          "Cart quantity increased"
        )
      );
  }

  // =========================
  // Validate Product Stock
  // =========================

  if (product.stock <= 0) {
    throw new ApiError(
      400,
      "Product is out of stock"
    );
  }

  // =========================
  // Create Cart Item
  // =========================

  const newCartItem = await Cart.create({
    user: userId,
    product: productId,
  });

  // =========================
  // Send Response
  // =========================

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newCartItem,
        "Cart item created successfully"
      )
    );
});



const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // =========================
  // Get Cart Items
  // =========================

  const cartItems = await Cart.find({
    user: userId,
  }).populate("product");

  // =========================
  // Cart Is Empty
  // =========================

  if (cartItems.length === 0) {
    return res
      .status(200)
      .json(
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

  // =========================
  // Calculate Total Quantity
  // =========================

  const totalItems = cartItems.reduce(
    (total, item) => {
      return total + item.quantity;
    },
    0
  );

  // =========================
  // Calculate Total Amount
  // =========================

  const totalAmount = cartItems.reduce(
    (total, item) => {
      return total + (
        item.product.price * item.quantity
      );
    },
    0
  );

  // =========================
  // Prepare Cart Data
  // =========================

  const cartData = {
    totalItems,
    totalAmount,
    cartItems,
  };

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        cartData,
        "Cart fetched successfully"
      )
    );
});


const deleteCart = asyncHandler(async (req, res) => {
  const cartId = req.params.cartId;

  // =========================
  // Validate Cart ID
  // =========================

  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    throw new ApiError(
      400,
      "Invalid Cart ID"
    );
  }

  // =========================
  // Find And Delete Cart Item
  // =========================

  const cart = await cartModel
    .findOneAndDelete({
      _id: cartId,
      user: req.user.id,
    })
    .populate("product")
    .populate("user", "name email");

  // =========================
  // Cart Item Not Found
  // =========================

  if (!cart) {
    throw new ApiError(
      404,
      "Cart item not found"
    );
  }

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        cart,
        "Cart item deleted successfully"
      )
    );
});



// Why did you use

// findOneAndDelete()

// instead of

// findByIdAndDelete()
// Answer

// Because I also need to verify that the cart item belongs to the 
// authenticated user. findOneAndDelete() allows me to match both 
// _id and user, preventing users from deleting someone else's cart item.


const updateCart = asyncHandler(async (req, res) => {
  const cartId = req.params.cartId;

  // =========================
  // Validate Cart ID
  // =========================

  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    throw new ApiError(
      400,
      "Invalid Cart ID"
    );
  }

  // =========================
  // Get Quantity
  // =========================

  const { quantity } = req.body;

  // =========================
  // Validate Quantity
  // =========================

  if (isNaN(quantity) || quantity < 1) {
    throw new ApiError(
      400,
      "Quantity must be at least 1"
    );
  }

  // =========================
  // Find Cart Item
  // =========================

  const cart = await cartModel
    .findOne({
      _id: cartId,
      user: req.user.id,
    })
    .populate("product");

  // =========================
  // Cart Item Not Found
  // =========================

  if (!cart) {
    throw new ApiError(
      404,
      "Cart item not found"
    );
  }

  // =========================
  // Validate Product
  // =========================

  if (!cart.product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }

  // =========================
  // Validate Product Stock
  // =========================

  if (quantity > cart.product.stock) {
    throw new ApiError(
      400,
      "Requested quantity exceeds available stock"
    );
  }

  // =========================
  // Update Cart Quantity
  // =========================

  cart.quantity = quantity;

  await cart.save();

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
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
    updateCart
}