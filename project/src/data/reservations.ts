export const TIME_SLOTS = ['12:00 PM', '1:00 PM', '2:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];

export type ReservationStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
  tableId: string;
  tableNumber: number;
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
}

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const mockReservations: Reservation[] = [
  { id: 'r1', userId: 'u1', customerName: 'Alice Johnson', customerEmail: 'alice@example.com', date: fmt(addDays(today, 2)), time: '7:00 PM', guests: 2, tableId: 't1', tableNumber: 1, status: 'confirmed', createdAt: fmt(addDays(today, -5)) },
  { id: 'r2', userId: 'u2', customerName: 'Bob Martinez', customerEmail: 'bob@example.com', date: fmt(addDays(today, 3)), time: '8:00 PM', guests: 4, tableId: 't3', tableNumber: 3, status: 'confirmed', createdAt: fmt(addDays(today, -4)) },
  { id: 'r3', userId: 'u3', customerName: 'Carol White', customerEmail: 'carol@example.com', date: fmt(today), time: '12:00 PM', guests: 3, tableId: 't2', tableNumber: 2, status: 'confirmed', notes: 'Anniversary dinner', createdAt: fmt(addDays(today, -3)) },
  { id: 'r4', userId: 'u4', customerName: 'David Kim', customerEmail: 'david@example.com', date: fmt(addDays(today, -2)), time: '6:00 PM', guests: 5, tableId: 't4', tableNumber: 4, status: 'completed', createdAt: fmt(addDays(today, -10)) },
  { id: 'r5', userId: 'u5', customerName: 'Eva Chen', customerEmail: 'eva@example.com', date: fmt(addDays(today, -1)), time: '9:00 PM', guests: 2, tableId: 't5', tableNumber: 5, status: 'cancelled', createdAt: fmt(addDays(today, -7)) },
  { id: 'r6', userId: 'u1', customerName: 'Alice Johnson', customerEmail: 'alice@example.com', date: fmt(addDays(today, -5)), time: '1:00 PM', guests: 2, tableId: 't2', tableNumber: 2, status: 'completed', createdAt: fmt(addDays(today, -14)) },
  { id: 'r7', userId: 'u2', customerName: 'Bob Martinez', customerEmail: 'bob@example.com', date: fmt(today), time: '7:00 PM', guests: 6, tableId: 't6', tableNumber: 6, status: 'confirmed', createdAt: fmt(addDays(today, -2)) },
  { id: 'r8', userId: 'u3', customerName: 'Carol White', customerEmail: 'carol@example.com', date: fmt(addDays(today, 5)), time: '2:00 PM', guests: 4, tableId: 't3', tableNumber: 3, status: 'confirmed', createdAt: fmt(addDays(today, -1)) },
];
