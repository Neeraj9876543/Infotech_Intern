const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const responseHandler = require('../utils/responseHandler');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return responseHandler(res, 401, false, 'Authentication required');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return responseHandler(res, 401, false, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return responseHandler(res, 401, false, 'Invalid token');
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return responseHandler(res, 403, false, 'Not authorized to access this resource');
    }
    next();
  };
};
