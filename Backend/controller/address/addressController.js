const AddressModel = require("../../models/address/Address");
const userModel = require("../../models/user");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");


const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    fullName,
    phone,
    street,
    city,
    state,
    pincode,
    country,
  } = req.body;

  // ==========================
  // Validation
  // ==========================

  if (
    !fullName?.trim() ||
    !phone?.trim() ||
    !street?.trim() ||
    !city?.trim() ||
    !state?.trim() ||
    !pincode?.trim() ||
    !country?.trim()
  ) {
    throw new ApiError(
      400,
      "All fields are required"
    );
  }

  // ==========================
  // First Address Check
  // ==========================

  const addressCount = await AddressModel.countDocuments({
    user: userId,
  });

  const isDefault = addressCount === 0;

  // ==========================
  // Create Address
  // ==========================

  const address = await AddressModel.create({
    user: userId,
    fullName: fullName.trim(),
    phone: phone.trim(),
    street: street.trim(),
    city: city.trim(),
    state: state.trim(),
    pincode: pincode.trim(),
    country: country.trim(),
    isDefault,
  });

  // ==========================
  // Send Response
  // ==========================

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        address,
        "Address added successfully"
      )
    );
});




const getMyAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // ==========================
  // Get User Addresses
  // ==========================

  const addresses = await AddressModel
    .find({
      user: userId,
    })
    .sort({
      createdAt: -1,
    });

  // ==========================
  // No Addresses Found
  // ==========================

  if (addresses.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            totalAddresses: 0,
            addresses: [],
          },
          "No addresses found"
        )
      );
  }

  // ==========================
  // Prepare Address Data
  // ==========================

  const addressData = {
    totalAddresses: addresses.length,
    addresses,
  };

  // ==========================
  // Send Response
  // ==========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        addressData,
        "Addresses fetched successfully"
      )
    );
});



const updateAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.addressId;

  // ==========================
  // Validate Address ID
  // ==========================

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(
      400,
      "Invalid Address ID"
    );
  }

  // ==========================
  // Find Address
  // ==========================

  const address = await AddressModel.findById(addressId);

  if (!address) {
    throw new ApiError(
      404,
      "Address not found"
    );
  }

  // ==========================
  // Ownership Check
  // ==========================

  if (address.user.toString() !== req.user.id) {
    throw new ApiError(
      403,
      "You can update only your own address"
    );
  }

  // ==========================
  // Get Address Data
  // ==========================

  const {
    fullName,
    phone,
    street,
    city,
    state,
    pincode,
    country,
  } = req.body;

  // ==========================
  // Validate Address Data
  // ==========================

  if (
    !fullName?.trim() ||
    !phone?.trim() ||
    !street?.trim() ||
    !city?.trim() ||
    !state?.trim() ||
    !pincode?.trim() ||
    !country?.trim()
  ) {
    throw new ApiError(
      400,
      "All fields are required"
    );
  }

  // ==========================
  // Update Address
  // ==========================

  address.fullName = fullName.trim();
  address.phone = phone.trim();
  address.street = street.trim();
  address.city = city.trim();
  address.state = state.trim();
  address.pincode = pincode.trim();
  address.country = country.trim();

  // ==========================
  // Save Address
  // ==========================

  await address.save();

  // ==========================
  // Send Response
  // ==========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        address,
        "Address updated successfully"
      )
    );
});



const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.addressId;

  // ==========================
  // Validate Address ID
  // ==========================

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(
      400,
      "Invalid Address ID"
    );
  }

  // ==========================
  // Find Address
  // ==========================

  const address = await AddressModel.findById(addressId);

  if (!address) {
    throw new ApiError(
      404,
      "Address not found"
    );
  }

  // ==========================
  // Ownership Check
  // ==========================

  if (address.user.toString() !== req.user.id) {
    throw new ApiError(
      403,
      "You can delete only your own address"
    );
  }

  // ==========================
  // Delete Address
  // ==========================

  await address.deleteOne();

  // ==========================
  // Handle Default Address
  // ==========================

  if (address.isDefault) {
    const nextAddress = await AddressModel.findOne({
      user: req.user.id,
    });

    if (nextAddress) {
      nextAddress.isDefault = true;

      await nextAddress.save();
    }
  }

  // ==========================
  // Send Response
  // ==========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        address,
        "Address deleted successfully"
      )
    );
});



module.exports = {
  addAddress,
  getMyAddress,
  updateAddress,
  deleteAddress,
};
