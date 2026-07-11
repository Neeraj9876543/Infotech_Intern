import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUsers, FiHash, FiEye, FiX, FiCheckCircle } from 'react-icons/fi';
import { Reservation } from '../../data/reservations';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onView?: (reservation: Reservation) => void;
  showCustomer?: boolean;
}

export default function ReservationCard({ reservation, onCancel, onComplete, onView, showCustomer = false }: ReservationCardProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleCancel = () => {
    onCancel?.(reservation.id);
    setConfirmCancel(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card card-hover border border-gray-100"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            {showCustomer && <p className="font-semibold text-gray-900 mb-0.5">{reservation.customerName}</p>}
            <p className="text-sm text-gray-400">Reservation #{reservation.id.slice(-6).toUpperCase()}</p>
          </div>
          <Badge variant={reservation.status}>{reservation.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiCalendar className="w-4 h-4 text-brand-400" />
            <span>{new Date(reservation.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiClock className="w-4 h-4 text-brand-400" />
            <span>{reservation.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiUsers className="w-4 h-4 text-brand-400" />
            <span>{reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiHash className="w-4 h-4 text-brand-400" />
            <span>Table {reservation.tableNumber}</span>
          </div>
        </div>
        {reservation.notes && (
          <p className="text-sm text-gray-400 italic mb-4 bg-gray-50 rounded-lg px-3 py-2">"{reservation.notes}"</p>
        )}
        <div className="flex gap-2 pt-2 border-t border-gray-50">
          {onView && <Button variant="ghost" size="sm" icon={<FiEye className="w-4 h-4" />} onClick={() => onView(reservation)}>View</Button>}
          {onComplete && reservation.status === 'confirmed' && (
            <Button variant="ghost" size="sm" icon={<FiCheckCircle className="w-4 h-4" />} className="!text-emerald-600 hover:!bg-emerald-50" onClick={() => onComplete(reservation.id)}>Complete</Button>
          )}
          {onCancel && reservation.status === 'confirmed' && (
            <Button variant="ghost" size="sm" icon={<FiX className="w-4 h-4" />} className="!text-red-500 hover:!bg-red-50" onClick={() => setConfirmCancel(true)}>Cancel</Button>
          )}
        </div>
      </motion.div>
      <ConfirmDialog
        isOpen={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={handleCancel}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmLabel="Cancel Reservation"
      />
    </>
  );
}
