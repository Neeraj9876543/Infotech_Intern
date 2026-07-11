import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import { Reservation } from '../../data/reservations';
import { FiCalendar, FiClock, FiUsers, FiHash, FiMail, FiMessageSquare } from 'react-icons/fi';

interface ViewReservationModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-brand-400 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function ViewReservationModal({ reservation, isOpen, onClose }: ViewReservationModalProps) {
  if (!reservation) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reservation Details" size="sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-semibold text-gray-900">{reservation.customerName}</p>
          <p className="text-xs text-gray-400">ID: #{reservation.id.slice(-8).toUpperCase()}</p>
        </div>
        <Badge variant={reservation.status} size="md">{reservation.status}</Badge>
      </div>
      <div>
        <Row icon={<FiCalendar className="w-4 h-4" />} label="Date"
          value={new Date(reservation.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} />
        <Row icon={<FiClock className="w-4 h-4" />} label="Time" value={reservation.time} />
        <Row icon={<FiUsers className="w-4 h-4" />} label="Guests" value={`${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}`} />
        <Row icon={<FiHash className="w-4 h-4" />} label="Table" value={`Table ${reservation.tableNumber}`} />
        <Row icon={<FiMail className="w-4 h-4" />} label="Email" value={reservation.customerEmail} />
        {reservation.notes && <Row icon={<FiMessageSquare className="w-4 h-4" />} label="Notes" value={reservation.notes} />}
        <Row icon={<FiCalendar className="w-4 h-4" />} label="Booked On"
          value={new Date(reservation.createdAt + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
      </div>
    </Modal>
  );
}
