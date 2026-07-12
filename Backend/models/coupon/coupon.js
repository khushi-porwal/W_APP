const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema({
    code : {
        type: String,
        required: true,
        unique: true,
        uppercase:true,
        trim: true
    },
    discountPercentage : {
        type:Number,
        required:true,
        min:1,
        max:100
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default:false
    },
    minimumAmount: {
        type:Number,
        default: 0,
        min:0
    },
    maxDiscount: {
        type: Number,
        default: 500,
        min:0
    },
    usageLimit:{
    type:Number,
    min:1
    },
    usedCount:{
    type:Number,
    default:0
    }
}, {timestamps : true})

const couponModel = mongoose.model("Coupon", couponSchema)

module.exports = couponModel;