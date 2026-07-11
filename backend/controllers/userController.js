const User = require('../models/User');
const responseHandler = require('../utils/responseHandler');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      joinedAt: user.createdAt
    }));

    responseHandler(res, 200, true, 'Users retrieved successfully', formattedUsers);
  } catch (error) {
    responseHandler(res, 500, false, 'Error retrieving users', null, [error.message]);
  }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { name, phone, role } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return responseHandler(res, 404, false, 'User not found');
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;

    await user.save();

    responseHandler(res, 200, true, 'User updated successfully', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      joinedAt: user.createdAt
    });
  } catch (error) {
    responseHandler(res, 500, false, 'Error updating user', null, [error.message]);
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return responseHandler(res, 404, false, 'User not found');
    }

    await User.findByIdAndDelete(id);
    responseHandler(res, 200, true, 'User deleted successfully');
  } catch (error) {
    responseHandler(res, 500, false, 'Error deleting user', null, [error.message]);
  }
};
