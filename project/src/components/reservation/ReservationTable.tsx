import { useState } from 'react';
import { Reservation } from '../../data/reservations';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import { FiCalendar, FiEdit2, FiEye, FiX } from 'react-icons/fi';

interface ReservationTableProps {
  reservations: Reservation[];
  onView?: (r: Reservation) => void;
  onEdit?: (r: Reservation) => void;
  onCancel?: (id: string) => void;
  showCustomer?: boolean;
}

export default function ReservationTable({ reservations, onView, onEdit, onCancel, showCustomer = false }: ReservationTableProps) {
  const [cancelId, setCancelId] = useState<string | null>(null);

  const handleCancel = () => {
    if (cancelId) { onCancel?.(cancelId); setCancelId(null); }
  };

  if (!reservations.length) {
    return <EmptyState title="No reservations found" message="No reservations match your current filters." icon={<FiCalendar className="w-8 h-8" />} />;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              {showCustomer && <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Customer</th>}
              <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Date</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Time</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Guests</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Table</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reservations.map(r => (
              <tr key={r.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                {showCustomer && <td className="px-4 py-3.5 font-medium text-gray-800">{r.customerName}</td>}
                <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                  {new Date(r.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-3.5 text-gray-600">{r.time}</td>
                <td className="px-4 py-3.5 text-gray-600">{r.guests}</td>
                <td className="px-4 py-3.5 text-gray-600">Table {r.tableNumber}</td>
                <td className="px-4 py-3.5"><Badge variant={r.status}>{r.status}</Badge></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    {onView && <button onClick={() => onView(r)} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors" title="View"><FiEye className="w-4 h-4" /></button>}
                    {onEdit && <button onClick={() => onEdit(r)} className="p-1.5 hover:bg-amber-50 text-amber-500 rounded-lg transition-colors" title="Edit"><FiEdit2 className="w-4 h-4" /></button>}
                    {onCancel && r.status === 'confirmed' && <button onClick={() => setCancelId(r.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Cancel"><FiX className="w-4 h-4" /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation?"
        confirmLabel="Cancel Reservation"
      />
    </>
  );
}
