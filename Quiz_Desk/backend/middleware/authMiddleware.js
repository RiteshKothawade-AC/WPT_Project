
const jwt = require('jsonwebtoken');

// Check whether the user is logged in
const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    // Check whether token is provided
    if (!authHeader) {
        return res.status(401).json({
            message: 'Access denied. Please login first.'
        });
    }

    // Get token from Bearer token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Token not provided'
        });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({
                message: 'Invalid or expired token'
            });
        }

        req.user = user;

        next();
    });
};


// Check user role
const authorizeRole = (requiredRole) => {

    return (req, res, next) => {

        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                message: 'You do not have permission'
            });
        }

        next();
    };

};

module.exports = {
    authenticateToken,
    authorizeRole
};
