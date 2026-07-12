const adminMiddleware = (req,res,next) => {
    if(!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access Denied. Admin access required"
        });
    }
    next();
}
module.exports = adminMiddleware;




// Why are we checking req.user.role?

// Answer

// Because authMiddleware already verified the JWT 
// and stored the decoded payload inside req.user. 
// We reuse that information to authorize the request.






// Step 2: Status Code
// return res.status(403)
// ✅ Perfect.
// Many students confuse:
// 401
// and
// 403
// Let's understand.

// 401 Unauthorized

// Means

// You are not logged in.

// Example

// No Token

// ↓

// 401
// 403 Forbidden

// Means

// You are logged in,

// but

// You don't have permission.

// Example

// User

// ↓

// Delete Product

// ↓

// 403

// Exactly your case.











// Difference between Authentication and Authorization?

// This is one of the most common interview questions.

// Authentication

// Authentication verifies who the user is.

// Example

// JWT Verification

// ↓

// Is token valid?

// Handled by:

// authMiddleware
// Authorization

// Authorization checks what the user is allowed to do.

// Example

// Is user an admin?

// ↓

// Yes

// ↓

// Allow
