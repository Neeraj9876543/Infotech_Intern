const { body, validationResult, query } = require('express-validator');
const responseHandler = require('../utils/responseHandler');

exports.validateReservation = [
  body('reservationDate')
    .notEmpty()
    .withMessage('Reservation date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),
  
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .isIn([
      '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM',
      '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
    ])
    .withMessage('Invalid time slot'),
  
  body('guests')
    .notEmpty()
    .withMessage('Number of guests is required')
    .isInt({ min: 1 })
    .withMessage('At least 1 guest is required'),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler(res, 400, false, 'Validation failed', null, errors.array().map(e => e.msg));
    }
    next();
  }
];

exports.validateDateQuery = [
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler(res, 400, false, 'Validation failed', null, errors.array().map(e => e.msg));
    }
    next();
  }
];
