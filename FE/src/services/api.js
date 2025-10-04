import axios from 'axios';

class GarageAPI {
  constructor() {
    this.baseURLs = [
      'http://127.0.0.1:5000/api',
      'http://localhost:5000/api'
    ];
    this.currentBaseURL = this.baseURLs[0];
    this.api = this.createApiInstance();
  }

  createApiInstance(baseURL = this.currentBaseURL) {
    const instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
          console.error('💡 Backend server is not running or not accessible');
        } else if (error.response) {
          console.error(`📊 Server responded with: ${error.response.status}`, error.response.data);
        }
        
        return Promise.reject(error);
      }
    );

    return instance;
  }

  async healthCheck() {
    for (const url of this.baseURLs) {
      try {
        console.log(`🔍 Testing backend connection: ${url}`);
        const testApi = this.createApiInstance(url);
        const response = await testApi.get('/health');
        
        if (response.data.status === 'healthy') {
          console.log(`✅ Backend connected: ${url}`);
          this.currentBaseURL = url;
          this.api = this.createApiInstance(url);
          return response.data;
        }
      } catch (error) {
        console.log(`❌ Backend not available: ${url}`);
      }
    }
    
    throw new Error('No backend server available. Please start the backend server.');
  }

  // Customer API
  customer = {
    getAll: () => this.api.get('/customers'),
    create: (data) => this.api.post('/customers', data),
  };

  // Service API
  service = {
    getAll: () => this.api.get('/services'),
    create: (data) => this.api.post('/services', data),
  };

  // Appointment API
  appointment = {
    getAll: () => this.api.get('/appointments'),
    create: (data) => this.api.post('/appointments', data),
    update: (id, data) => this.api.put(`/appointments/${id}`, data),
  };

  // Billing API
  billing = {
    getAll: () => this.api.get('/billing'),
    create: (data) => this.api.post('/billing', data),
    markPaid: (id) => this.api.put(`/billing/${id}/pay`),
  };
}

// Create singleton instance
const garageAPI = new GarageAPI();

// Export individual methods for backward compatibility
export const customerAPI = garageAPI.customer;
export const serviceAPI = garageAPI.service;
export const appointmentAPI = garageAPI.appointment;
export const billingAPI = garageAPI.billing;
export const healthCheck = () => garageAPI.healthCheck();
export default garageAPI;