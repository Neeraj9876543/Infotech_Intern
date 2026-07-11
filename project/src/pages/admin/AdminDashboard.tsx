import { motion } from 'framer-motion';
import { FiCalendar, FiXCircle, FiCheckCircle, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useReservations } from '../../context/ReservationContext';
import { useTables } from '../../context/TableContext';
import PageHeader from '../../components/ui/PageHeader';
import ReservationTable from '../../components/reservation/ReservationTable';
import Badge from '../../components/ui/Badge';

function StatCard({ icon: Icon, label, value, color, trend }: { icon: React.ElementType; label: string; value: number; color: string; trend?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card card-hover">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-serif font-bold text-gray-900">{value}</p>
      {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { reservations, cancelReservation } = useReservations();
  const { availableCount } = useTables();

  const today = new Date().toISOString().split('T')[0];
  const todayRes = reservations.filter(r => r.date === today);
  const cancelled = reservations.filter(r => r.status === 'cancelled');
  const recent = [...reservations].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const statusDist = ['confirmed', 'completed', 'cancelled'].map(s => ({
    status: s, count: reservations.filter(r => r.status === s).length,
  }));

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Overview of your restaurant operations." breadcrumb="Admin Panel" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={FiTrendingUp} label="Total Reservations" value={reservations.length} color="bg-brand-50 text-brand-500" />
        <StatCard icon={FiCalendar} label="Today's Reservations" value={todayRes.length} color="bg-blue-50 text-blue-500" trend={`${today}`} />
        <StatCard icon={FiCheckCircle} label="Available Tables" value={availableCount} color="bg-sage-50 text-sage-500" />
        <StatCard icon={FiXCircle} label="Cancelled" value={cancelled.length} color="bg-red-50 text-red-400" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-serif font-semibold text-gray-900">Recent Reservations</h2>
            <Link to="/admin/reservations" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">View all <FiArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <ReservationTable reservations={recent} onCancel={cancelReservation} showCustomer />
        </div>
        <div className="card">
          <h2 className="text-lg font-serif font-semibold text-gray-900 mb-5">Status Overview</h2>
          <div className="space-y-4">
            {statusDist.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={status as 'confirmed' | 'completed' | 'cancelled'}>{status}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${status === 'confirmed' ? 'bg-sage-400' : status === 'completed' ? 'bg-blue-400' : 'bg-red-400'}`}
                      style={{ width: `${reservations.length ? (count / reservations.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Today's breakdown</p>
            <div className="space-y-2">
              {todayRes.length === 0 ? <p className="text-sm text-gray-400 italic">No reservations today</p> : todayRes.map(r => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{r.customerName.split(' ')[0]}</span>
                  <span className="text-gray-400">{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
