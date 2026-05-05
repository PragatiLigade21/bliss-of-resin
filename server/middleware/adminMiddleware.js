/**
 * Admin Middleware
 * Checks if user is authenticated and has admin privileges
 * Supports both isAdmin (boolean) and role (string) fields
 */

module.exports = (req, res, next) => {
  // This middleware should be used after authMiddleware
  // It checks if the authenticated user is an admin
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  // Check both isAdmin (boolean) and role (string) for backward compatibility
  const isAdmin = req.user.isAdmin === true || req.user.role === "admin";
  
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  next();
};
