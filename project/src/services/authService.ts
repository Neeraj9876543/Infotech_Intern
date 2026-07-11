import apiClient from './apiClient';

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string, role?: string) =>
    apiClient.post('/auth/register', { name, email, password, role }),

  logout: () => {
    localStorage.removeItem('authToken');
    return Promise.resolve();
  },

  getProfile: () =>
    apiClient.get('/auth/me'),
};
