import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ role }: { role?: 'customer' | 'admin' }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }
  return <Outlet />;
}

export function RedirectIfAuth() {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }
  return <Outlet />;
}
