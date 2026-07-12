const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      "User created successfully",
    ),
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    throw new ApiError(401, "Invalid eamil and password");
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: existingUser._id,
      role: existingUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
      },
      "User logged in successfully",
    ),
  );
});

const profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "User profile fetched successfully",
    ),
  );
});
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "email not found");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  // ============================
  // Hash Token
  // ============================

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // ============================
  // Save Token & Expiry
  // ============================

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save();

  // ============================
  // Reset URL
  // ============================

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // ============================
  // Email Message
  // ============================

  const message = `
            <h2>Password Reset Request</h2>

            <p>Hello ${user.name},</p>

            <p>You requested to reset your password.</p>

            <p>
                Click the button below to reset your password:
            </p>

            <a href="${resetUrl}" 
               style="
                    background:#007bff;
                    color:white;
                    padding:10px 20px;
                    text-decoration:none;
                    border-radius:5px;
               ">
               Reset Password
            </a>

            <p>This link will expire in <strong>15 minutes</strong>.</p>

            <p>If you did not request this, please ignore this email.</p>
        `;

  // ============================
  // Send Email
  // ============================

  await sendEmail({
    email: user.email,
    subject: "Password Reset Request",
    message,
  });
   return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                
                 "Password reset email sent successfully"
            )
        );
});
const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;

  const { password, confirmPassword } = req.body;

  // ===========================
  // Validation
  // ===========================

  if (!password || !confirmPassword) {
    throw new ApiError(400, "Password and Confirm Password are required");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "passwords do not match");
  }

  if (password.length < 8) {
    throw new ApiError(400, "password min 8 characters");
  }

  // ===========================
  // Hash Incoming Token
  // ===========================

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // ===========================
  // Find User
  // ===========================

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  }).select("+password");

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  // ===========================
  // Hash Password
  // ===========================

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;

  // ===========================
  // Clear Token
  // ===========================

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Password Reset Sucessfully"
            )
        );
});

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and Confirm password do not match");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new ApiError(400, "New password must be different from old password");
  }

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "password changed successfully"
            )
        );
});
module.exports = {
  signupUser,
  loginUser,
  profile,
  forgotPassword,
  resetPassword,
  changePassword,
};

//Why are you using req.user.id instead of req.params.id?"

//"The profile API should return the currently
// logged-in user's profile. The req.user.id is
//  added by the authentication middleware after
// verifying the JWT token, so the user cannot
// access another user's profile simply by changing
// the URL."
