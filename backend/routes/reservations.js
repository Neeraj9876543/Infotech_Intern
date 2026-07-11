const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateReservation, validateDateQuery } = require('../validators/reservationValidator');

// Customer routes
router.post('/', authenticate, authorize('customer', 'admin'), validateReservation, reservationController.createReservation);
router.get('/my', authenticate, authorize('customer', 'admin'), reservationController.getMyReservations);
router.put('/:id', authenticate, authorize('customer', 'admin'), reservationController.updateReservation);
router.delete('/:id', authenticate, authorize('customer', 'admin'), reservationController.cancelReservation);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), validateDateQuery, reservationController.getAllReservations);
router.put('/admin/:id', authenticate, authorize('admin'), reservationController.updateReservation);
router.delete('/admin/:id', authenticate, authorize('admin'), reservationController.deleteReservation);

module.exports = router;
