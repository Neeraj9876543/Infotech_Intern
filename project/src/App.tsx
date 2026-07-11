import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReservationProvider } from './context/ReservationContext';
import { TableProvider } from './context/TableContext';
import { ToastProvider } from './context/ToastContext';
import { RequireAuth, RedirectIfAuth } from './routes/guards';
import ToastContainer from './components/ui/ToastContainer';

import PublicLayout from './layouts/PublicLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import ReserveTablePage from './pages/customer/ReserveTablePage';
import MyReservationsPage from './pages/customer/MyReservationsPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AllReservationsPage from './pages/admin/AllReservationsPage';
import ReservationsByDatePage from './pages/admin/ReservationsByDatePage';
import TableManagementPage from './pages/admin/TableManagementPage';
import UsersPage from './pages/admin/UsersPage';

export default function App() {
  return (
    <AuthProvider>
      <ReservationProvider>
        <TableProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route element={<RedirectIfAuth />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                  </Route>
                </Route>

                {/* Customer */}
                <Route element={<RequireAuth role="customer" />}>
                  <Route element={<CustomerLayout />}>
                    <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                    <Route path="/customer/reserve" element={<ReserveTablePage />} />
                    <Route path="/customer/reservations" element={<MyReservationsPage />} />
                    <Route path="/customer/profile" element={<CustomerProfilePage />} />
                  </Route>
                </Route>

                {/* Admin */}
                <Route element={<RequireAuth role="admin" />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/reservations" element={<AllReservationsPage />} />
                    <Route path="/admin/date" element={<ReservationsByDatePage />} />
                    <Route path="/admin/tables" element={<TableManagementPage />} />
                    <Route path="/admin/users" element={<UsersPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            <ToastContainer />
          </ToastProvider>
        </TableProvider>
      </ReservationProvider>
    </AuthProvider>
  );
}
