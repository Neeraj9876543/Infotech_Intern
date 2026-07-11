import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReservations } from '../../context/ReservationContext';
import { Reservation } from '../../data/reservations';
import ReservationCard from '../../components/reservation/ReservationCard';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ViewReservationModal from '../../components/reservation/ViewReservationModal';
import { FiCalendar } from 'react-icons/fi';

type Filter = 'all' | 'confirmed' | 'completed' | 'cancelled';

export default function MyReservationsPage() {
  const { user } = useAuth();
  const { getByUser, cancelReservation, updateReservation } = useReservations();
  const [filter, setFilter] = useState<Filter>('all');
  const [viewing, setViewing] = useState<Reservation | null>(null);

  const reservations = getByUser(user?.id || '');
  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div>
      <PageHeader title="My Reservations" subtitle="Track and manage all your table reservations." breadcrumb="Customer" />
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === t.key ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'}`}>
            {t.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === t.key ? 'bg-white/20' : 'bg-gray-100'}`}>
              {t.key === 'all' ? reservations.length : reservations.filter(r => r.status === t.key).length}
            </span>
          </button>
        ))}
      </div>
      {sorted.length === 0 ? (
        <EmptyState
          title="No reservations found"
          message={filter === 'all' ? "You haven't made any reservations yet." : `No ${filter} reservations found.`}
          icon={<FiCalendar className="w-8 h-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map(r => (
            <ReservationCard key={r.id} reservation={r} onCancel={cancelReservation} onComplete={id => void updateReservation(id, { status: 'completed' })} onView={setViewing} />
          ))}
        </div>
      )}
      <ViewReservationModal reservation={viewing} isOpen={!!viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
