const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateTable } = require('../validators/tableValidator');

// Admin routes
router.get('/', authenticate, authorize('admin'), tableController.getAllTables);
router.post('/', authenticate, authorize('admin'), validateTable, tableController.createTable);
router.put('/:id', authenticate, authorize('admin'), validateTable, tableController.updateTable);
router.delete('/:id', authenticate, authorize('admin'), tableController.deleteTable);

// Customer route
router.get('/available', authenticate, authorize('customer', 'admin'), tableController.getAvailableTables);

module.exports = router;
