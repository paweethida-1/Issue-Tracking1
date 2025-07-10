// middleware/roleCheck.js
exports.requireRole = (roles) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!roles.includes(role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
};
