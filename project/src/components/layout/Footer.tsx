import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { user, isAuthenticated } = useAuth();

  const reservePath = isAuthenticated
    ? (user?.role === 'customer' ? '/customer/reserve' : '/admin/dashboard')
    : '/login';

  const dashboardPath = isAuthenticated
    ? (user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard')
    : '/login';

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Reserve a Table', to: reservePath },
    ...(isAuthenticated
      ? [{ label: 'Dashboard', to: dashboardPath }]
      : [
          { label: 'Login', to: '/login' },
          { label: 'Register', to: '/register' }
        ])
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold">T</span>
              </div>
              <span className="font-serif font-bold text-xl">TableMaestro</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-5 max-w-sm">
              Where every meal becomes a memory. Reserve your perfect table and experience dining at its finest.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-500 flex items-center justify-center transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {quickLinks.map(({ label, to }) => (
                <li key={to}><Link to={to} className="hover:text-brand-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2.5"><FiMapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />123 Gourmet Ave, NY 10001</li>
              <li className="flex items-center gap-2.5"><FiPhone className="w-4 h-4 text-brand-400 flex-shrink-0" />+1 (555) 123-4567</li>
              <li className="flex items-center gap-2.5"><FiMail className="w-4 h-4 text-brand-400 flex-shrink-0" />hello@tablemaestro.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} TableMaestro. All rights reserved.</p>
          <p>Crafted with passion for the finest dining experience.</p>
        </div>
      </div>
    </footer>
  );
}
