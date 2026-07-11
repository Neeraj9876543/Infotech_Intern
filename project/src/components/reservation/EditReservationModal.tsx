import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Reservation } from '../../data/reservations';
import { TIME_SLOTS } from '../../data/reservations';

interface EditReservationModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Reservation>) => void;
}

export default function EditReservationModal({ reservation, isOpen, onClose, onSave }: EditReservationModalProps) {
  const [date, setDate] = useState(reservation?.date || '');
  const [time, setTime] = useState(reservation?.time || '');
  const [guests, setGuests] = useState(String(reservation?.guests || 2));
  const [status, setStatus] = useState(reservation?.status || 'confirmed');

  if (!reservation) return null;

  const handleSave = () => {
    onSave(reservation.id, { status, timeSlot: time, guests: Number(guests) });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Reservation"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Time Slot</label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map(slot => (
              <button key={slot} onClick={() => setTime(slot)}
                className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all duration-200 ${time === slot ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}>
                {slot}
              </button>
            ))}
          </div>
        </div>
        <Input label="Number of Guests" type="number" min="1" max="20" value={guests} onChange={e => setGuests(e.target.value)} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Reservation Status</label>
          <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
