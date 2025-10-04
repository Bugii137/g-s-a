import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API response error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running or not accessible');
    }
    return Promise.reject(error);
  }
);

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

// Health check function
export const healthCheck = () => api.get('/health');

export default api;