const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        return res.status(401).json({
            message: "No Authorization Header"
        })
    }
    if(!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid Authorization format"
        })
    }
    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next();
    } catch(err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
    
}

module.exports = authMiddleware;




// Why are you storing the decoded token in req.user?

// Answer:

// After verifying the JWT, we attach the decoded payload 
// to req.user so that downstream controllers can access 
// the authenticated user's information, such as id and 
// role, without verifying the token again.










// Why do we check Bearer?
// Answer:
// Because the standard HTTP Authorization header for JWT is:

// Authorization: Bearer <token>

// Checking the prefix ensures the request follows 
// the expected format before we extract and verify the token.