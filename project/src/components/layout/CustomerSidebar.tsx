import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiCalendar, FiList, FiUser, FiLogOut, FiMenu, FiX, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/customer/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/customer/reserve', icon: FiBookOpen, label: 'Reserve Table' },
  { to: '/customer/reservations', icon: FiList, label: 'My Reservations' },
  { to: '/customer/profile', icon: FiUser, label: 'Profile' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerSidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 mb-4">
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-serif font-bold">T</span>
        </div>
        <div>
          <p className="font-serif font-semibold text-gray-900 leading-tight">TableMaestro</p>
          <p className="text-xs text-brand-500 font-medium">Customer Portal</p>
        </div>
      </div>
      <div className="px-3 mb-6">
        <div className="bg-brand-50 rounded-xl px-3 py-3">
          <p className="text-xs text-brand-400 font-medium mb-0.5">Signed in as</p>
          <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}>
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
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 fixed top-0 left-0 bottom-0 z-30">
        <SidebarContent />
      </aside>
      {/* Mobile overlay */}
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
