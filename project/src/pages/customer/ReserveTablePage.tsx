import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiUsers, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { useReservations } from '../../context/ReservationContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';

interface FormErrors { date?: string; time?: string; guests?: string; }

export default function ReserveTablePage() {
  const { createReservation, error, TIME_SLOTS } = useReservations();
  const { showToast } = useToast();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<{ tableNumber: number } | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!date) e.date = 'Please select a date.';
    else if (date < today) e.date = 'Date cannot be in the past.';
    if (!time) e.time = 'Please select a time slot.';
    if (!guests || Number(guests) < 1) e.guests = 'Enter at least 1 guest.';
    if (Number(guests) > 20) e.guests = 'Maximum 20 guests per reservation.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    
    // We send reservationDate, timeSlot, guests, notes to the backend
    const result = await createReservation({
      reservationDate: date,
      timeSlot: time,
      guests: Number(guests),
      notes: notes
    });
    
    setLoading(false);
    
    if (result.success) {
      setConfirmed({ tableNumber: result.tableNumber || 0 });
      showToast('Reservation confirmed!', 'success');
      setDate(''); setTime(''); setGuests(''); setNotes('');
    } else {
      showToast(result.message || error || 'Failed to create reservation', 'error');
    }
  };

  return (
    <div>
      <PageHeader title="Reserve a Table" subtitle="Select your preferred date, time and party size." breadcrumb="Customer" />
      <div className="max-w-2xl">
        {confirmed && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-sage-50 border border-sage-200 rounded-2xl p-5 flex items-start gap-4">
            <FiCheckCircle className="w-6 h-6 text-sage-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sage-800">Reservation Confirmed!</p>
              <p className="text-sm text-sage-600 mt-0.5">You've been assigned <span className="font-bold">Table {confirmed.tableNumber}</span>. We look forward to seeing you!</p>
            </div>
          </motion.div>
        )}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Reservation Date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={today}
              icon={<FiCalendar className="w-4 h-4" />}
              error={errors.date}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
              {errors.time && <p className="text-xs text-red-500 mb-2">{errors.time}</p>}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {TIME_SLOTS.map(slot => (
                  <button key={slot} type="button" onClick={() => setTime(slot)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${time === slot ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:bg-brand-50/50'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Number of Guests"
              type="number"
              min="1"
              max="20"
              placeholder="How many guests?"
              value={guests}
              onChange={e => setGuests(e.target.value)}
              icon={<FiUsers className="w-4 h-4" />}
              error={errors.guests}
              hint="Maximum 20 guests per reservation"
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Special Requests (optional)</label>
              <div className="relative">
                <FiMessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <textarea
                  className="input-field pl-10 resize-none"
                  rows={3}
                  placeholder="Allergies, celebrations, special seating..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full" loading={loading} size="lg">
                Confirm Reservation
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
