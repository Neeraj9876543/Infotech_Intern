import { useState } from 'react';
import { useReservations } from '../../context/ReservationContext';
import { Reservation } from '../../data/reservations';
import PageHeader from '../../components/ui/PageHeader';
import ReservationTable from '../../components/reservation/ReservationTable';
import ViewReservationModal from '../../components/reservation/ViewReservationModal';
import EditReservationModal from '../../components/reservation/EditReservationModal';
import Input from '../../components/ui/Input';
import { FiSearch } from 'react-icons/fi';

export default function AllReservationsPage() {
  const { reservations, cancelReservation, updateReservation } = useReservations();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewing, setViewing] = useState<Reservation | null>(null);
  const [editing, setEditing] = useState<Reservation | null>(null);

  const filtered = reservations.filter(r => {
    const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader title="All Reservations" subtitle={`${reservations.length} total reservations`} breadcrumb="Admin" />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} icon={<FiSearch className="w-4 h-4" />} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize border transition-all duration-200 ${statusFilter === s ? 'bg-sage-500 text-white border-sage-500' : 'bg-white text-gray-600 border-gray-200 hover:border-sage-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <ReservationTable reservations={sorted} onView={setViewing} onEdit={setEditing} onCancel={cancelReservation} showCustomer />
      </div>
      <ViewReservationModal reservation={viewing} isOpen={!!viewing} onClose={() => setViewing(null)} />
      <EditReservationModal reservation={editing} isOpen={!!editing} onClose={() => setEditing(null)} onSave={updateReservation} />
    </div>
  );
}
