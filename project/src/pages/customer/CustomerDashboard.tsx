import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiXCircle, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReservations } from '../../context/ReservationContext';
import ReservationCard from '../../components/reservation/ReservationCard';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card card-hover">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-serif font-bold text-gray-900">{value}</p>
    </motion.div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { getByUser, cancelReservation } = useReservations();
  const reservations = getByUser(user?.id || '');

  const today = new Date().toISOString().split('T')[0];
  const upcoming = reservations.filter(r => r.status === 'confirmed' && r.date >= today);
  const cancelled = reservations.filter(r => r.status === 'cancelled');
  const recent = [...reservations].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  return (
    <div>
      <PageHeader
        title={`Good day, ${user?.name?.split(' ')[0]}!`}
        subtitle="Here's an overview of your reservations."
        breadcrumb="Customer Dashboard"
        action={
          <Link to="/customer/reserve" className="btn-primary flex items-center gap-2 text-sm">
            New Reservation <FiArrowRight className="w-4 h-4" />
          </Link>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={FiTrendingUp} label="Total Reservations" value={reservations.length} color="bg-brand-50 text-brand-500" />
        <StatCard icon={FiCalendar} label="Upcoming" value={upcoming.length} color="bg-sage-50 text-sage-500" />
        <StatCard icon={FiXCircle} label="Cancelled" value={cancelled.length} color="bg-red-50 text-red-400" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-serif font-semibold text-gray-900">Recent Reservations</h2>
          <Link to="/customer/reservations" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
            View all <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title="No reservations yet"
            message="Make your first reservation and enjoy a wonderful dining experience."
            action={{ label: 'Reserve a Table', onClick: () => {} }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recent.map(r => (
              <ReservationCard key={r.id} reservation={r} onCancel={cancelReservation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
