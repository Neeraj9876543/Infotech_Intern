import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const links = [
    { to: '/', label: 'Home' },
    ...(isAuthenticated
      ? [
          ...(user?.role === 'customer' ? [{ to: '/customer/reserve', label: 'Reserve a Table' }] : []),
          { to: user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard', label: 'Dashboard' }
        ]
      : [
          { to: '/login', label: 'Login' },
          { to: '/register', label: 'Register' }
        ])
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-card px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm">T</span>
            </div>
            <span className="font-serif font-semibold text-gray-900 text-lg">TableMaestro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {links.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === link.to ? 'bg-brand-500 text-white' : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'}`}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 ml-2"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </nav>
          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mt-2 bg-white rounded-2xl shadow-card-hover border border-gray-100 p-3">
              {links.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === link.to ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogoutClick();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 mt-1"
                >
                  <FiLogOut className="w-4.5 h-4.5" />
                  Logout
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
