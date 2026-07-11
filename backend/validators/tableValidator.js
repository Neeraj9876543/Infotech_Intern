const { body, validationResult } = require('express-validator');
const responseHandler = require('../utils/responseHandler');

exports.validateTable = [
  body('tableNumber')
    .trim()
    .notEmpty()
    .withMessage('Table number is required'),
  
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),

  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),

  body('status')
    .optional()
    .isIn(['available', 'reserved', 'maintenance'])
    .withMessage('Status must be available, reserved, or maintenance'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler(res, 400, false, 'Validation failed', null, errors.array().map(e => e.msg));
    }
    next();
  }
];
