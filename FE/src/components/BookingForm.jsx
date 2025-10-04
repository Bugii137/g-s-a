import React, { useState, useEffect } from 'react';
import { serviceAPI, healthCheck } from '../services/api';

const BookingForm = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service_id: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      setBackendStatus('checking');
      await healthCheck();
      setBackendStatus('connected');
      loadServices();
    } catch (error) {
      setBackendStatus('disconnected');
      setMessage('❌ Backend server is not running. Please start the backend server.');
      console.error('Backend health check failed:', error);
    }
  };

  const loadServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
      setMessage('❌ Error loading services. Please check if backend is running on port 5000.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (backendStatus !== 'connected') {
      setMessage('❌ Cannot book appointment. Backend server is not connected.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage('✅ Appointment booked successfully!');
      setFormData({
        name: '',
        phone: '',
        email: '',
        service_id: '',
        date: '',
        time: ''
      });
    } catch (error) {
      setMessage('❌ Error booking appointment. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return '#28a745';
      case 'disconnected': return '#dc3545';
      case 'checking': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2>Book Service Appointment</h2>
          <div style={{
            padding: '5px 10px',
            backgroundColor: getBackendStatusColor(),
            color: 'white',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            Backend: {backendStatus}
          </div>
        </div>
        
        {message && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '20px', 
            backgroundColor: message.includes('❌') ? '#f8d7da' : '#d4edda',
            color: message.includes('❌') ? '#721c24' : '#155724',
            borderRadius: '4px'
          }}>
            {message}
          </div>
        )}

        {backendStatus === 'disconnected' && (
          <div style={{ 
            padding: '15px', 
            marginBottom: '20px', 
            backgroundColor: '#fff3cd',
            color: '#856404',
            borderRadius: '4px',
            border: '1px solid #ffeaa7'
          }}>
            <strong>Backend Server Not Running</strong>
            <p style={{ margin: '5px 0 0 0' }}>
              Please start the backend server by running:<br />
              <code style={{ background: '#f8f9fa', padding: '2px 5px', borderRadius: '3px' }}>
                cd BE && source venv/Scripts/activate && python app.py
              </code>
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={backendStatus !== 'connected'}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                opacity: backendStatus === 'connected' ? 1 : 0.6
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={backendStatus !== 'connected'}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                opacity: backendStatus === 'connected' ? 1 : 0.6
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={backendStatus !== 'connected'}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                opacity: backendStatus === 'connected' ? 1 : 0.6
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Service *</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              required
              disabled={backendStatus !== 'connected' || services.length === 0}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                opacity: backendStatus === 'connected' ? 1 : 0.6
              }}
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - KES {service.price}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={backendStatus !== 'connected'}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                opacity: backendStatus === 'connected' ? 1 : 0.6
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time *</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={backendStatus !== 'connected'}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                opacity: backendStatus === 'connected' ? 1 : 0.6
              }}
            >
              <option value="">Select time</option>
              <option value="08:00 AM">08:00 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          <button 
            type="submit" 
            style={{
              backgroundColor: backendStatus === 'connected' ? '#007bff' : '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: backendStatus === 'connected' ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              opacity: backendStatus === 'connected' ? 1 : 0.6
            }}
            disabled={loading || backendStatus !== 'connected'}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;