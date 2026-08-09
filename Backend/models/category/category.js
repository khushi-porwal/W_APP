const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        image: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const categoryModel = mongoose.model("Category",categorySchema)
module.exports = categoryModel