const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const User = require('../models/User');
const responseHandler = require('../utils/responseHandler');

const syncTableStatus = async (tableId, reservationDate, timeSlot, reservationId, status) => {
  if (!tableId) return;

  const table = await Table.findById(tableId);
  if (!table || table.status === 'maintenance') return;

  const hasActiveReservation = await Reservation.findOne({
    table: tableId,
    reservationDate,
    timeSlot,
    status: 'confirmed',
    _id: { $ne: reservationId }
  });

  if (status === 'available' && !hasActiveReservation) {
    table.status = 'available';
    table.isActive = true;
    await table.save();
  } else if (status === 'reserved') {
    table.status = 'reserved';
    table.isActive = true;
    await table.save();
  }
};

// Helper function to find available table
const findAvailableTable = async (guests, date, timeSlot) => {
  const reservationDate = new Date(date);
  reservationDate.setUTCHours(0, 0, 0, 0);

  // Find all active tables with sufficient capacity
  const tables = await Table.find({
    isActive: true,
    status: { $ne: 'maintenance' },
    capacity: { $gte: guests }
  }).sort({ capacity: 1 }); // Sort by capacity to get smallest suitable table first

  // For each table, check if it's already booked for the given date and time
  for (const table of tables) {
    const existingReservation = await Reservation.findOne({
      table: table._id,
      reservationDate: reservationDate,
      timeSlot: timeSlot,
      status: 'confirmed'
    });

    if (!existingReservation) {
      return table;
    }
  }

  return null; // No available table found
};

exports.createReservation = async (req, res) => {
  try {
    const { reservationDate, timeSlot, guests, notes } = req.body;

    // Find available table
    const table = await findAvailableTable(guests, reservationDate, timeSlot);
    
    if (!table) {
      return responseHandler(res, 409, false, 'This table is already booked or unavailable. Please choose another slot.');
    }

    // Create reservation
    const reservationDateUTC = new Date(reservationDate);
    reservationDateUTC.setUTCHours(0, 0, 0, 0);

    const reservation = await Reservation.create({
      customer: req.user._id,
      table: table._id,
      reservationDate: reservationDateUTC,
      timeSlot,
      guests,
      notes: notes || ''
    });

    await syncTableStatus(table._id, reservationDateUTC, timeSlot, reservation._id, 'reserved');

    // Update user reservation stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'reservationStats.total': 1,
        'reservationStats.upcoming': 1
      }
    });

    // Populate table details
    await reservation.populate('table');

    responseHandler(res, 201, true, 'Reservation created successfully', reservation);
  } catch (error) {
    responseHandler(res, 500, false, 'Error creating reservation', null, [error.message]);
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ customer: req.user._id })
      .populate('customer', 'name email')
      .populate('table')
      .sort({ reservationDate: -1, timeSlot: 1 });

    responseHandler(res, 200, true, 'Reservations retrieved successfully', reservations);
  } catch (error) {
    responseHandler(res, 500, false, 'Error retrieving reservations', null, [error.message]);
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      customer: req.user._id
    });

    if (!reservation) {
      return responseHandler(res, 404, false, 'Reservation not found');
    }

    if (reservation.status === 'cancelled') {
      return responseHandler(res, 400, false, 'Reservation is already cancelled');
    }

    reservation.status = 'cancelled';
    await reservation.save();
    await syncTableStatus(reservation.table, reservation.reservationDate, reservation.timeSlot, reservation._id, 'available');

    // Update user reservation stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'reservationStats.upcoming': -1,
        'reservationStats.cancelled': 1
      }
    });

    responseHandler(res, 200, true, 'Reservation cancelled successfully', reservation);
  } catch (error) {
    responseHandler(res, 500, false, 'Error cancelling reservation', null, [error.message]);
  }
};

// Admin controllers
exports.getAllReservations = async (req, res) => {
  try {
    const { date } = req.query;
    
    let query = {};
    if (date) {
      const queryDate = new Date(date);
      queryDate.setUTCHours(0, 0, 0, 0);
      const nextDay = new Date(queryDate);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      
      query.reservationDate = {
        $gte: queryDate,
        $lt: nextDay
      };
    }

    const reservations = await Reservation.find(query)
      .populate('customer', 'name email')
      .populate('table')
      .sort({ reservationDate: -1, timeSlot: 1 });

    responseHandler(res, 200, true, 'Reservations retrieved successfully', reservations);
  } catch (error) {
    responseHandler(res, 500, false, 'Error retrieving reservations', null, [error.message]);
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { status, timeSlot, guests } = req.body;
    
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return responseHandler(res, 404, false, 'Reservation not found');
    }

    if (req.user.role !== 'admin' && reservation.customer.toString() !== req.user._id.toString()) {
      return responseHandler(res, 403, false, 'You are not allowed to update this reservation');
    }

    // Track status changes for user stats
    const oldStatus = reservation.status;
    const previousTableId = reservation.table;
    const previousTimeSlot = reservation.timeSlot;
    const previousReservationDate = reservation.reservationDate;

    // If updating timeSlot or guests, need to reassign table
    if (timeSlot || guests) {
      const newTimeSlot = timeSlot || reservation.timeSlot;
      const newGuests = guests || reservation.guests;
      
      const table = await findAvailableTable(newGuests, reservation.reservationDate, newTimeSlot);
      
      if (!table) {
        return responseHandler(res, 409, false, 'This table is already booked or unavailable. Please choose another slot.');
      }

      reservation.table = table._id;
      if (timeSlot) reservation.timeSlot = timeSlot;
      if (guests) reservation.guests = guests;
    }

    if (status) {
      reservation.status = status;

      if (oldStatus === 'confirmed' && status === 'completed') {
        await User.findByIdAndUpdate(reservation.customer, {
          $inc: {
            'reservationStats.upcoming': -1
          }
        });
      } else if (oldStatus === 'cancelled' && status === 'confirmed') {
        await User.findByIdAndUpdate(reservation.customer, {
          $inc: {
            'reservationStats.upcoming': 1,
            'reservationStats.cancelled': -1
          }
        });
      }
    }

    await reservation.save();

    if (status === 'completed') {
      await syncTableStatus(reservation.table, reservation.reservationDate, reservation.timeSlot, reservation._id, 'available');
    } else if (status === 'confirmed' && oldStatus !== 'confirmed') {
      await syncTableStatus(reservation.table, reservation.reservationDate, reservation.timeSlot, reservation._id, 'reserved');
    } else if ((timeSlot || guests) && previousTableId && previousTableId.toString() !== reservation.table.toString()) {
      await syncTableStatus(previousTableId, previousReservationDate, previousTimeSlot, reservation._id, 'available');
      await syncTableStatus(reservation.table, reservation.reservationDate, reservation.timeSlot, reservation._id, 'reserved');
    } else if (oldStatus === 'confirmed' && status !== 'confirmed') {
      await syncTableStatus(reservation.table, reservation.reservationDate, reservation.timeSlot, reservation._id, 'available');
    }
    await reservation.populate('table');

    responseHandler(res, 200, true, 'Reservation updated successfully', reservation);
  } catch (error) {
    responseHandler(res, 500, false, 'Error updating reservation', null, [error.message]);
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return responseHandler(res, 404, false, 'Reservation not found');
    }

    await Reservation.findByIdAndDelete(req.params.id);
    await syncTableStatus(reservation.table, reservation.reservationDate, reservation.timeSlot, reservation._id, 'available');

    responseHandler(res, 200, true, 'Reservation deleted successfully');
  } catch (error) {
    responseHandler(res, 500, false, 'Error deleting reservation', null, [error.message]);
  }
};
