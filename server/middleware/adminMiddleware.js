export const adminMiddleware = (req, res, next) => {
    // req.user is populated by your preceding verifyToken middleware
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            message: 'Access denied. Admin privileges required.' 
        });
    }
    
    // User is an admin, proceed to the route controller
    next();
};