require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Category = require("./models/category/category");
const Product = require("./models/products/product");
const Coupon = require("./models/coupon/coupon");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/EcommerceDB");
        console.log("MongoDB connected for seeding.");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Coupon.deleteMany({});

        console.log("Cleared existing database records.");

        // 1. Create Users
        const adminPassword = await bcrypt.hash("admin1234", 10);
        const userPassword = await bcrypt.hash("user1234", 10);

        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: adminPassword,
            role: "admin"
        });

        const demoUser = await User.create({
            name: "Khushi Porwal",
            email: "user@example.com",
            password: userPassword,
            role: "user"
        });

        console.log("Created Admin and User accounts.");

        // 2. Create Categories
        const categories = await Category.insertMany([
            {
                name: "Electronics",
                slug: "electronics",
                description: "Gadgets, audio gear, smartwatches and tech accessories.",
                image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80",
                isActive: true
            },
            {
                name: "Fashion",
                slug: "fashion",
                description: "Trendy apparel, streetwear, jackets and footwear.",
                image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80",
                isActive: true
            },
            {
                name: "Home & Living",
                slug: "home-living",
                description: "Modern home decor, lighting, furniture and lifestyle items.",
                image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
                isActive: true
            },
            {
                name: "Beauty & Accessories",
                slug: "beauty-accessories",
                description: "Premium watches, sunglasses, bags and cosmetics.",
                image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
                isActive: true
            }
        ]);

        console.log("Created Categories.");

        // 3. Create Products
        const products = [
            {
                name: "Wireless Noise Cancelling Headphones",
                price: 14999,
                description: "Immersive sound experience with active noise cancellation, 30-hour battery life, and ultra-soft memory foam ear cushions.",
                category: "Electronics",
                stock: 45,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Smart Fitness Watch Ultra",
                price: 5999,
                description: "High-definition AMOLED display, heart rate monitor, SpO2 sensor, GPS tracking, and water resistance up to 50 meters.",
                category: "Electronics",
                stock: 30,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Minimalist Leather Backpack",
                price: 3499,
                description: "Crafted from genuine full-grain leather, featuring a padded 15-inch laptop sleeve and water-resistant lining.",
                category: "Beauty & Accessories",
                stock: 20,
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Over-Ear Studio Monitor Headphones",
                price: 8999,
                description: "Professional audio fidelity with flat frequency response for producers and music enthusiasts.",
                category: "Electronics",
                stock: 15,
                image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Classic Denim Jacket",
                price: 2999,
                description: "Timeless denim jacket tailored with durable stitching, brass buttons, and a comfortable relaxed fit.",
                category: "Fashion",
                stock: 25,
                image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Urban Sneaker Runner",
                price: 4999,
                description: "Lightweight mesh upper with responsive foam cushioning for everyday comfort and athletic style.",
                category: "Fashion",
                stock: 40,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Nordic Minimalist Desk Lamp",
                price: 2199,
                description: "Touch-sensitive LED desk lamp with adjustable color temperatures and dimmable brightness.",
                category: "Home & Living",
                stock: 18,
                image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Ceramic Succulent Planter Set",
                price: 1299,
                description: "Set of 3 geometric ceramic plant pots with natural bamboo drainage trays for modern desktop greenery.",
                category: "Home & Living",
                stock: 50,
                image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Polarized Aviator Sunglasses",
                price: 1899,
                description: "UV400 protection with lightweight metal frame and scratch-resistant TAC lenses.",
                category: "Beauty & Accessories",
                stock: 35,
                image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Mechanical Gaming Keyboard RGB",
                price: 6499,
                description: "Hot-swappable tactile switches, dynamic RGB backlighting per key, and solid aluminum top plate.",
                category: "Electronics",
                stock: 12,
                image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Organic Cotton Casual Hoodie",
                price: 2499,
                description: "Ultra-soft brushed fleece lining, double-layered hood, and ribbed cuffs for maximum warmth.",
                category: "Fashion",
                stock: 28,
                image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
            },
            {
                name: "Aroma Diffuser & Humidifier",
                price: 1799,
                description: "Ultrasonic mist technology with 7 ambient LED colors and quiet operation for essential oils.",
                category: "Home & Living",
                stock: 22,
                image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80"
            }
        ];

        await Product.insertMany(products);
        console.log("Created Products.");

        // 4. Create Coupons
        await Coupon.insertMany([
            {
                code: "WELCOME10",
                discountPercentage: 10,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                isActive: true,
                minimumAmount: 1000,
                maxDiscount: 500,
                usageLimit: 100,
                usedCount: 0
            },
            {
                code: "FLAT500",
                discountPercentage: 20,
                expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                isActive: true,
                minimumAmount: 2500,
                maxDiscount: 500,
                usageLimit: 50,
                usedCount: 0
            }
        ]);
        console.log("Created Coupons.");

        console.log("\n==========================================");
        console.log("DATABASE SEEDED SUCCESSFULLY!");
        console.log("Admin Email    : admin@example.com");
        console.log("Admin Password : admin1234");
        console.log("User Email     : user@example.com");
        console.log("User Password  : user1234");
        console.log("==========================================\n");

        process.exit(0);
    } catch (error) {
        console.error("Error Seeding Database:", error);
        process.exit(1);
    }
};

seedData();
