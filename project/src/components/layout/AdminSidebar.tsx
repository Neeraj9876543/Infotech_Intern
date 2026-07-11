import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiCalendar, FiList, FiUsers, FiLogOut, FiLayout } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/reservations', icon: FiList, label: 'All Reservations' },
  { to: '/admin/date', icon: FiCalendar, label: 'By Date' },
  { to: '/admin/tables', icon: FiLayout, label: 'Tables' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 mb-4">
        <div className="w-9 h-9 bg-sage-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-serif font-bold">T</span>
        </div>
        <div>
          <p className="font-serif font-semibold text-gray-900 leading-tight">TableMaestro</p>
          <p className="text-xs text-sage-500 font-medium">Admin Panel</p>
        </div>
      </div>
      <div className="px-3 mb-6">
        <div className="bg-sage-50 rounded-xl px-3 py-3">
          <p className="text-xs text-sage-500 font-medium mb-0.5">Signed in as</p>
          <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
          <p className="text-xs text-gray-400">Administrator</p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? '!bg-sage-500 text-white shadow-sm' : 'sidebar-link-inactive'}`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button onClick={handleLogout} className="sidebar-link sidebar-link-inactive w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 fixed top-0 left-0 bottom-0 z-30">
        <SidebarContent />
      </aside>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-100 z-50 lg:hidden flex flex-col">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
