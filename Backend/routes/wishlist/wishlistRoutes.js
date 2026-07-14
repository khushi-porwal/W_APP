const express = require('express');
const { addToWishlist, getWishlist, deleteWishlist } = require('../../controller/wishlist/wishlistController');
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware")
/**
 * @swagger
 * /add-to-wishlist/{productId}:
 *   post:
 *     summary: Add product to user wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to add to wishlist
 *     responses:
 *       201:
 *         description: Wishlist item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistResponse'
 *       400:
 *         description: Invalid Product ID
 *       401:
 *         description: Unauthorized or invalid token
 *       404:
 *         description: Product not found
 *       409:
 *         description: Product already in wishlist
 */

router.post("/add-to-wishlist/:productId",addToWishlist)


/**
 * @swagger
 * /get-wishlist:
 *   get:
 *     summary: Get logged in user wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully or wishlist is empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wishlist'
 *                 message:
 *                   type: string
 *                   example: Wishlist fetched successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized or invalid token
 */
router.get("/get-wishlist", authMiddleware, getWishlist);


/**
 * @swagger
 * /remove-from-wishlist/{productId}:
 *   delete:
 *     summary: Remove product from user wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove from wishlist
 *     responses:
 *       200:
 *         description: Wishlist item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 *                 message:
 *                   type: string
 *                   example: Wishlist item removed successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid Product ID
 *       401:
 *         description: Unauthorized or invalid token
 *       404:
 *         description: Wishlist item not found
 */
router.delete(
  "/remove-from-wishlist/:productId",
  authMiddleware,
  deleteWishlist
);



module.exports = router;