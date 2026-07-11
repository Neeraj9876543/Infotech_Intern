import { useState } from 'react';
import { useReservations } from '../../context/ReservationContext';
import { Reservation } from '../../data/reservations';
import PageHeader from '../../components/ui/PageHeader';
import ReservationTable from '../../components/reservation/ReservationTable';
import ViewReservationModal from '../../components/reservation/ViewReservationModal';
import EmptyState from '../../components/ui/EmptyState';
import { FiCalendar } from 'react-icons/fi';

export default function ReservationsByDatePage() {
  const { getByDate, cancelReservation } = useReservations();
  const [date, setDate] = useState('');
  const [viewing, setViewing] = useState<Reservation | null>(null);

  const reservations = date ? getByDate(date) : [];

  return (
    <div>
      <PageHeader title="Reservations by Date" subtitle="Filter reservations for a specific day." breadcrumb="Admin" />
      <div className="max-w-xs mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Date</label>
        <input
          type="date"
          className="input-field"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      {!date ? (
        <EmptyState title="Select a date" message="Choose a date above to see reservations for that day." icon={<FiCalendar className="w-8 h-8" />} />
      ) : reservations.length === 0 ? (
        <EmptyState
          title="No reservations"
          message={`No reservations found for ${new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`}
          icon={<FiCalendar className="w-8 h-8" />}
        />
      ) : (
        <div className="card">
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-semibold text-gray-800">{reservations.length}</span> reservation{reservations.length !== 1 ? 's' : ''} on{' '}
            {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <ReservationTable reservations={reservations} onView={setViewing} onCancel={cancelReservation} showCustomer />
        </div>
      )}
      <ViewReservationModal reservation={viewing} isOpen={!!viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
