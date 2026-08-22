const jwt = require("jsonwebtoken");

/**
 * Optional Authentication Middleware:
 * If Authorization header with valid JWT is present, attaches req.user.
 * If not present or invalid, proceeds gracefully without failing.
 */
const optionalAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            if (token && token !== "null" && token !== "undefined") {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
            }
        }
    } catch (err) {
        // Token invalid or expired - proceed as unauthenticated guest
        req.user = null;
    }
    next();
};

module.exports = optionalAuthMiddleware;
