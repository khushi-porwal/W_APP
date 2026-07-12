const express = require("express");
const { addAddress, getMyAddress, updateAddress, deleteAddress } = require("../../controller/address/addressController");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/add-address", authMiddleware, addAddress)
router.get("/get-my-address", authMiddleware, getMyAddress)
router.put("/update-address/:addressId", authMiddleware, updateAddress)
router.delete("/delete-address/:addressId", authMiddleware, deleteAddress)

module.exports = router