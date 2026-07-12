const mongoose  =  require("mongoose")

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "User"
    },

    fullName: {
        type:String,
        required : true,
        trim:true
    },
    phone: {
        type: String,
        required: true,
        trim:true
    },
    street: {
        type:String,
        required: true,
        trim:true
    },
    city: {
        type:String,
        required:true,
        trim:true
    },
    state: {
        type:String,
        required: true,
        trim:true
    },
    pincode: {
        type:String,
        required:true,
        trim:true,
        match:/^[0-9]{6}$/
    },
    country: {
        type:String,
        required : true
    },
    isDefault : {
        type:Boolean,
        default:false
    }
}, {timestamps:true})
AddressSchema.index({
    user:1
});
const AddressModel = mongoose.model("Address", AddressSchema);
module.exports = AddressModel