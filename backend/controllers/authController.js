const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const responseHandler = require('../utils/responseHandler');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return responseHandler(res, 400, false, 'User already exists with this email');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer'
    });

    // Generate token
    const token = generateToken(user._id);

    responseHandler(res, 201, true, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    responseHandler(res, 500, false, 'Error registering user', null, [error.message]);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return responseHandler(res, 401, false, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return responseHandler(res, 401, false, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    responseHandler(res, 200, true, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    responseHandler(res, 500, false, 'Error logging in', null, [error.message]);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    responseHandler(res, 200, true, 'User retrieved successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        reservationStats: user.reservationStats || { total: 0, upcoming: 0, cancelled: 0 }
      }
    });
  } catch (error) {
    responseHandler(res, 500, false, 'Error retrieving user', null, [error.message]);
  }
};
