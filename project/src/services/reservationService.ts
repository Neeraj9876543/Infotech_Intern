import apiClient from './apiClient';

export const reservationService = {
  // Customer endpoints
  getMyReservations: () => apiClient.get('/reservations/my'),
  createReservation: (data: {
    reservationDate: string;
    timeSlot: string;
    guests: number;
  }) => apiClient.post('/reservations', data),
  cancelReservation: (id: string) => apiClient.delete(`/reservations/${id}`),

  // Admin endpoints
  getAllReservations: (date?: string) => {
    const params = date ? `?date=${date}` : '';
    return apiClient.get(`/reservations/admin/all${params}`);
  },
  updateReservation: (id: string, data: {
    status?: string;
    timeSlot?: string;
    guests?: number;
  }) => apiClient.put(`/reservations/${id}`, data),
  deleteReservation: (id: string) => apiClient.delete(`/reservations/admin/${id}`),
};
