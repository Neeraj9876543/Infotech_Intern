const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const responseHandler = require('../utils/responseHandler');

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    responseHandler(res, 200, true, 'Tables retrieved successfully', tables);
  } catch (error) {
    responseHandler(res, 500, false, 'Error retrieving tables', null, [error.message]);
  }
};

exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, location, status, isActive } = req.body;

    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return responseHandler(res, 400, false, 'Table with this number already exists');
    }

    const resolvedStatus = status || (isActive === false ? 'maintenance' : 'available');
    const resolvedIsActive = isActive !== undefined ? isActive : resolvedStatus !== 'maintenance';

    const table = await Table.create({
      tableNumber,
      capacity,
      location: location || 'Main Hall',
      status: resolvedStatus,
      isActive: resolvedIsActive
    });

    responseHandler(res, 201, true, 'Table created successfully', table);
  } catch (error) {
    responseHandler(res, 500, false, 'Error creating table', null, [error.message]);
  }
};

exports.updateTable = async (req, res) => {
  try {
    const { tableNumber, capacity, location, status, isActive } = req.body;

    const table = await Table.findById(req.params.id);
    if (!table) {
      return responseHandler(res, 404, false, 'Table not found');
    }

    if (tableNumber && tableNumber !== table.tableNumber) {
      const existingTable = await Table.findOne({ tableNumber });
      if (existingTable) {
        return responseHandler(res, 400, false, 'Table with this number already exists');
      }
    }

    if (tableNumber) table.tableNumber = tableNumber;
    if (capacity) table.capacity = capacity;
    if (location) table.location = location;

    if (status !== undefined) {
      table.status = status;
      table.isActive = status !== 'maintenance';
    }

    if (isActive !== undefined) {
      table.isActive = isActive;
      if (status === undefined && isActive === false) {
        table.status = 'maintenance';
      }
      if (status === undefined && isActive === true && table.status === 'maintenance') {
        table.status = 'available';
      }
    }

    await table.save();

    responseHandler(res, 200, true, 'Table updated successfully', table);
  } catch (error) {
    responseHandler(res, 500, false, 'Error updating table', null, [error.message]);
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return responseHandler(res, 404, false, 'Table not found');
    }

    // Check if table has active reservations
    const activeReservations = await Reservation.countDocuments({
      table: req.params.id,
      status: 'confirmed'
    });

    if (activeReservations > 0) {
      return responseHandler(res, 400, false, 'Cannot delete table with active reservations');
    }

    await Table.findByIdAndDelete(req.params.id);

    responseHandler(res, 200, true, 'Table deleted successfully');
  } catch (error) {
    responseHandler(res, 500, false, 'Error deleting table', null, [error.message]);
  }
};

// Customer endpoint to get available tables
exports.getAvailableTables = async (req, res) => {
  try {
    const { date, timeSlot, guests } = req.query;

    let query = { isActive: true, status: 'available' };

    if (guests) {
      query.capacity = { $gte: parseInt(guests) };
    }

    const allTables = await Table.find(query).sort({ capacity: 1 });

    // If date and timeSlot are provided, filter out booked tables
    if (date && timeSlot) {
      const reservationDate = new Date(date);
      reservationDate.setHours(0, 0, 0, 0);

      const bookedTableIds = await Reservation.find({
        reservationDate: reservationDate,
        timeSlot: timeSlot,
        status: 'confirmed'
      }).distinct('table');

      const availableTables = allTables.filter(
        table => !bookedTableIds.includes(table._id.toString())
      );

      return responseHandler(res, 200, true, 'Available tables retrieved successfully', availableTables);
    }

    responseHandler(res, 200, true, 'Tables retrieved successfully', allTables);
  } catch (error) {
    responseHandler(res, 500, false, 'Error retrieving tables', null, [error.message]);
  }
};
