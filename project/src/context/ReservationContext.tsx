import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { reservationService } from '../services/reservationService';
import { TIME_SLOTS, Reservation } from '../data/reservations';
import { useAuth } from './AuthContext';

interface NewReservation {
  reservationDate: string;
  timeSlot: string;
  guests: number;
  notes?: string;
}

interface ReservationContextType {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  createReservation: (data: NewReservation) => Promise<{ success: boolean; tableNumber?: number; message?: string }>;
  cancelReservation: (id: string) => Promise<boolean>;
  updateReservation: (id: string, data: { status?: string; timeSlot?: string; guests?: number }) => Promise<boolean>;
  refreshReservations: () => Promise<void>;
  getByUser: (userId: string) => Reservation[];
  getByDate: (date: string) => Reservation[];
  TIME_SLOTS: string[];
}

const ReservationContext = createContext<ReservationContextType | null>(null);

// Mapper to map database models to frontend types used in UI components
const mapBackendToFrontend = (r: any, currentUser?: any): Reservation => {
  const dateOnly = r.reservationDate ? r.reservationDate.split('T')[0] : '';
  
  let customerId = '';
  let customerName = '';
  let customerEmail = '';
  
  if (r.customer) {
    if (typeof r.customer === 'object') {
      customerId = r.customer._id || r.customer.id || '';
      customerName = r.customer.name || '';
      customerEmail = r.customer.email || '';
    } else {
      customerId = r.customer;
      if (currentUser && currentUser.id === customerId) {
        customerName = currentUser.name || '';
        customerEmail = currentUser.email || '';
      }
    }
  } else if (currentUser) {
    customerId = currentUser.id;
    customerName = currentUser.name;
    customerEmail = currentUser.email;
  }

  return {
    id: r._id,
    userId: customerId,
    customerName: customerName || 'Guest User',
    customerEmail: customerEmail || 'guest@example.com',
    date: dateOnly,
    time: r.timeSlot,
    guests: r.guests,
    tableId: r.table?._id || '',
    tableNumber: Number(r.table?.tableNumber) || 0,
    status: r.status || 'confirmed',
    notes: r.notes || '',
    createdAt: r.createdAt || new Date().toISOString(),
  };
};

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refreshReservations = async () => {
    if (!user) {
      setReservations([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let response;
      if (user.role === 'admin') {
        response = await reservationService.getAllReservations();
      } else {
        response = await reservationService.getMyReservations();
      }
      if (response.data.success) {
        const mapped = response.data.data.map((r: any) => mapBackendToFrontend(r, user));
        setReservations(mapped);
      } else {
        setError(response.data.message || 'Failed to load reservations');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshReservations();
    } else {
      setReservations([]);
    }
  }, [user]);

  const createReservation = async (data: NewReservation): Promise<{ success: boolean; tableNumber?: number; message?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationService.createReservation(data);
      if (response.data.success) {
        await refreshReservations();
        const createdRes = response.data.data;
        const tableNumber = Number(createdRes?.table?.tableNumber) || 0;
        return { success: true, tableNumber, message: response.data.message };
      } else {
        const errMsg = response.data.message || 'Failed to create reservation';
        setError(errMsg);
        return { success: false, message: errMsg };
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to create reservation';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationService.cancelReservation(id);
      if (response.data.success) {
        await refreshReservations();
        return true;
      } else {
        setError(response.data.message || 'Failed to cancel reservation');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel reservation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (
    id: string,
    data: { status?: string; timeSlot?: string; guests?: number }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationService.updateReservation(id, data);
      if (response.data.success) {
        await refreshReservations();
        return true;
      } else {
        setError(response.data.message || 'Failed to update reservation');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update reservation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getByUser = (userId: string) => {
    return reservations.filter(r => r.userId === userId);
  };

  const getByDate = (date: string) => {
    return reservations.filter(r => r.date === date);
  };

  return (
    <ReservationContext.Provider value={{ 
      reservations, 
      loading, 
      error, 
      createReservation, 
      cancelReservation, 
      updateReservation,
      refreshReservations,
      getByUser,
      getByDate,
      TIME_SLOTS 
    }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationProvider');
  return ctx;
}
