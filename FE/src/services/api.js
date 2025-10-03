import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customerAPI = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
};

export const serviceAPI = {
  getAll: () => api.get('/services'),
  create: (data) => api.post('/services', data),
};

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
};

export const billingAPI = {
  getAll: () => api.get('/billing'),
  create: (data) => api.post('/billing', data),
  markPaid: (id) => api.put(`/billing/${id}/pay`),
};

export default api;