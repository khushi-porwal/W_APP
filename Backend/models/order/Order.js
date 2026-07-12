const mongoose = require('mongoose')
const User = require("../../models/user")
const Address = require("../../models/address/Address")
const Product = require("../../models/products/product")
const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    items : [
        {
            product :  {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
            required: true
            },
            quantity : {
                type: Number,
                min: 1,
                required: true
            },
            price: {
                type:Number,
                required:true
            }
        }
      
    ],

    totalAmount : {
        type: Number,
        required: true
    },
    status : {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        required: true,
        default: "Pending"
    },
    paymentStatus : {
        type :String,
        enum: [
        "Pending",
        "Paid",
        "Failed",
        "REFUND_PENDING",
        "Refunded"
    ],
        default : "Pending"
    },
    paymentId : {
        type: String
    },
    razorpayOrderId: {
        type: String
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "Address"
    },
    coupon: {
        type:String,
        default: null
    },
    paidAt: {
        type: Date
    },
    originalAmount: {
    type: Number,
    required: true
    },

    discountAmount: {
    type: Number,
    default: 0
    },
    refundedAt: {
    type: Date
    },
    razorpaySignature: {
        type:String
    },
    paymentMethod: {
    type: String,
    enum: ["Razorpay", "CashOnDelivery"],
    default: "Razorpay"
    },

    refundReason: {
    type: String
    },
    deliveredAt: {
        type:Date
    }
}, {
    timestamps : true
});

orderSchema.index({
    user:1
});

const orderModel = mongoose.model("Order", orderSchema)
module.exports = orderModel;