const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const orderModel = require("../../models/order/Order");
const productModel = require("../../models/products/product");
const userModel = require("../../models/user");



const getAllOrder = asyncHandler(async (req, res) => {
  // =========================
  // Get All Orders
  // =========================

  const orders = await orderModel
    .find()
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("items.product");

  // =========================
  // No Orders Found
  // =========================

  if (orders.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            totalOrders: 0,
            orders: [],
          },
          "No orders found"
        )
      );
  }

  // =========================
  // Prepare Order Data
  // =========================

  const orderData = {
    totalOrders: orders.length,
    orders,
  };

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        orderData,
        "All orders fetched successfully"
      )
    );
});



const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  // =========================
  // Validate Order ID
  // =========================

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid Order ID"
    );
  }

  // =========================
  // Find Order
  // =========================

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  // =========================
  // Get Status
  // =========================

  const { status } = req.body;

  // =========================
  // Allowed Status
  // =========================

  const allowedStatus = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // =========================
  // Validate Status
  // =========================

  if (!allowedStatus.includes(status)) {
    throw new ApiError(
      400,
      "Invalid status"
    );
  }

  // =========================
  // Order Status Flow
  // =========================

  const statusFlow = {
    Pending: ["Processing", "Cancelled"],
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
  };

  // =========================
  // Validate Status Transition
  // =========================

  if (!statusFlow[order.status]?.includes(status)) {
    throw new ApiError(
      400,
      `Cannot change status from ${order.status} to ${status}`
    );
  }

  // =========================
  // Update Order Status
  // =========================

  order.status = status;

  // =========================
  // Handle Delivered Order
  // =========================

  if (status === "Delivered") {
    order.deliveredAt = new Date();

    if (order.paymentMethod === "COD") {
      order.paymentStatus = "Paid";
      order.paidAt = new Date();
    }
  }

  // =========================
  // Save Order
  // =========================

  await order.save();

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        "Order status updated successfully"
      )
    );
});



const getAllUser = asyncHandler(async (req, res) => {
  // =========================
  // Get All Users
  // =========================

  const users = await userModel
    .find()
    .sort({ createdAt: -1 })
    .select("-password");

  // =========================
  // No Users Found
  // =========================

  if (users.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            totalUsers: 0,
            users: [],
          },
          "No users found"
        )
      );
  }

  // =========================
  // Prepare User Data
  // =========================

  const userData = {
    totalUsers: users.length,
    users,
  };

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userData,
        "Users fetched successfully"
      )
    );
});



const getDashboardStats = asyncHandler(async (req, res) => {
  // =========================
  // Get Dashboard Counts
  // =========================

  const [
    totalUsers,
    totalProducts,
    totalOrders,
  ] = await Promise.all([
    userModel.countDocuments(),
    productModel.countDocuments(),
    orderModel.countDocuments(),
  ]);

  // =========================
  // Calculate Total Revenue
  // =========================

  const revenueResult = await orderModel.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

  // =========================
  // Get Total Revenue
  // =========================

  const totalRevenue =
    revenueResult.length > 0
      ? revenueResult[0].totalRevenue
      : 0;

  // =========================
  // Prepare Dashboard Data
  // =========================

  const dashboardData = {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
  };

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dashboardData,
        "Dashboard statistics fetched successfully"
      )
    );
});




const getTopSellingProducts = asyncHandler(async (req, res) => {
  // =========================
  // Get Top Selling Products
  // =========================

  const products = await orderModel.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
        status: {
          $ne: "Cancelled",
        },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.product",
        totalSold: {
          $sum: "$items.quantity",
        },
      },
    },
    {
      $sort: {
        totalSold: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo",
    },
    {
      $project: {
        _id: 0,
        name: "$productInfo.name",
        images: "$productInfo.images",
        price: "$productInfo.price",
        totalSold: 1,
      },
    },
  ]);

  // =========================
  // No Sales Data Found
  // =========================

  if (products.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          "No sales data found"
        )
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
        products,
        "Top selling products fetched successfully"
      )
    );
});





const getMonthlyRevenue = asyncHandler(async (req, res) => {
  // =========================
  // Get Monthly Revenue
  // =========================

  const monthlyRevenue = await orderModel.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        revenue: {
          $sum: "$totalAmount",
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        revenue: 1,
      },
    },
  ]);

  // =========================
  // No Revenue Found
  // =========================

  if (monthlyRevenue.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          "No revenue found"
        )
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
        monthlyRevenue,
        "Monthly revenue fetched successfully"
      )
    );
});



const getTopCategory = asyncHandler(async (req, res) => {
  // =========================
  // Get Top Categories
  // =========================

  const topCategories = await orderModel.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo",
    },
    {
      $group: {
        _id: "$productInfo.category",
        totalSold: {
          $sum: "$items.quantity",
        },
      },
    },
    {
      $sort: {
        totalSold: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalSold: 1,
      },
    },
  ]);

  // =========================
  // No Category Sales Found
  // =========================

  if (topCategories.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          "No category sales found"
        )
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
        topCategories,
        "Top categories fetched successfully"
      )
    );
});


const getLowStockProducts = asyncHandler(async (req, res) => {
  // =========================
  // Get Low Stock Products
  // =========================

  const products = await productModel
    .find({
      stock: {
        $lte: 5,
      },
    })
    .select("name stock category images")
    .sort({
      stock: 1,
    });

  // =========================
  // No Low Stock Products
  // =========================

  if (products.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            totalProducts: 0,
            products: [],
          },
          "No low stock products found"
        )
      );
  }

  // =========================
  // Prepare Product Data
  // =========================

  const productData = {
    totalProducts: products.length,
    products,
  };

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        productData,
        "Low stock products fetched successfully"
      )
    );
});


const getRecentOrder = asyncHandler(async (req, res) => {
  // =========================
  // Get Recent Orders
  // =========================

  const orders = await orderModel
    .find()
    .populate("user", "name email")
    .populate("items.product", "name price images")
    .sort({
      createdAt: -1,
    })
    .limit(5);

  // =========================
  // No Recent Orders Found
  // =========================

  if (orders.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            totalOrders: 0,
            orders: [],
          },
          "No recent orders found"
        )
      );
  }

  // =========================
  // Prepare Order Data
  // =========================

  const orderData = {
    totalOrders: orders.length,
    orders,
  };

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        orderData,
        "Recent orders fetched successfully"
      )
    );
});


const getOrderByStatus = asyncHandler(async (req, res) => {
  // =========================
  // Get Order Status Statistics
  // =========================

  const orderStatusStats = await orderModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  // =========================
  // No Orders Found
  // =========================

  if (orderStatusStats.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          "No orders found"
        )
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
        orderStatusStats,
        "Order status statistics fetched successfully"
      )
    );
});



const getBestCustomer = asyncHandler(async (req, res) => {
  // =========================
  // Get Best Customers
  // =========================

  const topCustomers = await orderModel.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
      },
    },
    {
      $group: {
        _id: "$user",
        totalSpent: {
          $sum: "$totalAmount",
        },
      },
    },
    {
      $sort: {
        totalSpent: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $project: {
        _id: 0,
        name: "$userInfo.name",
        email: "$userInfo.email",
        totalSpent: 1,
      },
    },
  ]);

  // =========================
  // No Customers Found
  // =========================

  if (topCustomers.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          "No customers found"
        )
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
        topCustomers,
        "Best customers fetched successfully"
      )
    );
});



module.exports = {
  getAllOrder,
  updateOrderStatus,
  getAllUser,
  getDashboardStats,
  getTopSellingProducts,
  getMonthlyRevenue,
  getTopCategory,
  getLowStockProducts,
  getRecentOrder,
  getOrderByStatus,
  getBestCustomer,
};

// $unwind  → Array todna
// $group   → Data aggregate karna
// $sum     → Quantity add karna
// $sort    → Ranking banana
// $lookup  → Join collections
// $project → Output customize karna
// $limit   → Top N records

// Difference
// $lt → Less Than (<)
// $lte → Less Than or Equal (<=)
// $gt → Greater Than (>)
// $gte → Greater Than or Equal (>=)
