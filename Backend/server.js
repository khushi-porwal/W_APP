const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

require('dotenv').config();
const express = require('express')
const app = express();
const connectDB = require('./config/db')
const errorHandler = require("./middleware/errorMiddleware")
const paymentRoutes = require("./routes/payment/paymentRoutes")
const orderRoutes = require("./routes/order/order")
const addressRoutes = require("./routes/address/addressRoutes")
const adminRoutes = require("./routes/admin/adminRoutes")
const authRoutes = require('./routes/authRoutes')
const reviewRoutes = require("./routes/review/review")
const cartRoutes = require("./routes/cart/cartRoutes")
const productRoutes = require("./routes/product/productRoutes")
const wishlistRoutes = require("./routes/wishlist/wishlistRoutes")
const cors = require("cors")
const helmet = require("helmet");
const rateLimit = require("express-rate-limit")

app.use(helmet())
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())

app.use(express.urlencoded({
    extended : true
}))


const limiter = rateLimit({
    windowMs:15*60*1000,
    max:100
});


app.use(limiter)
// Swagger Documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
app.use(authRoutes)
app.use(productRoutes)
app.use(cartRoutes)
app.use(orderRoutes)
app.use(addressRoutes)
app.use(reviewRoutes)
app.use(adminRoutes)
app.use(wishlistRoutes)
app.use(paymentRoutes)
app.use(errorHandler)

app.get("/health", (req,res) => {
    res.status(200).json({
        success:true,
        message:"Server is running"
    })
})

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

app.use((err, req, res, next) => {
    console.dir(err, { depth: null });

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});
const PORT = process.env.PORT||3000;
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

startServer();