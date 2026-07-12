const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    signupUser,
    loginUser,
    profile,
    forgotPassword,
    resetPassword,
    changePassword
} = require("../controller/authController");


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Khushi
 *               email:
 *                 type: string
 *                 format: email
 *                 example: khushi@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: All fields are required
 *       409:
 *         description: User already exists
 */
router.post("/signup", signupUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: anuj@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: All fields are required
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       404:
 *         description: User not found
 */
router.get("/profile", authMiddleware, profile);

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Send password reset link to user email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: anuj@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found
 */
router.post("/forgot-password", forgotPassword);
/**
 * @swagger
 * /reset-password/{token}:
 *   post:
 *     summary: Reset user password using reset token
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token received in email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 *       404:
 *         description: User not found
 */
router.post("/reset-password/:token", resetPassword);

/**
 * @swagger
 * /change-password:
 *   put:
 *     summary: Change logged in user password
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Old password and new password are required
 *       401:
 *         description: Old password is incorrect or unauthorized
 *       404:
 *         description: User not found
 */
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;