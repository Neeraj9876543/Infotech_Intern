import apiClient from './apiClient';

export const tableService = {
  // Admin endpoints
  getAllTables: () => apiClient.get('/tables'),
  createTable: (data: {
    tableNumber: string;
    capacity: number;
    location?: string;
    status?: 'available' | 'reserved' | 'maintenance';
    isActive?: boolean;
  }) => apiClient.post('/tables', data),
  updateTable: (id: string, data: {
    tableNumber?: string;
    capacity?: number;
    location?: string;
    status?: 'available' | 'reserved' | 'maintenance';
    isActive?: boolean;
  }) => apiClient.put(`/tables/${id}`, data),
  deleteTable: (id: string) => apiClient.delete(`/tables/${id}`),

  // Customer endpoint
  getAvailableTables: (params?: {
    date?: string;
    timeSlot?: string;
    guests?: number;
  }) => {
    const queryString = params 
      ? `?${new URLSearchParams(params as any).toString()}` 
      : '';
    return apiClient.get(`/tables/available${queryString}`);
  },
};
