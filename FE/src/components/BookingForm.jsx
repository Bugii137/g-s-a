import React, { useState, useEffect } from 'react';
import { serviceAPI, appointmentAPI, healthCheck } from '../services/api';

const BookingForm = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [message, setMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service_id: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    checkBackendConnection();
  }, [retryCount]);

  const checkBackendConnection = async () => {
    try {
      setBackendStatus('checking');
      setMessage('Connecting to backend server...');
      
      await healthCheck();
      setBackendStatus('connected');
      setMessage('');
      await loadServices();
      
    } catch (error) {
      setBackendStatus('disconnected');
      setMessage('❌ Cannot connect to backend server. Please make sure the backend is running.');
      console.error('Backend connection failed:', error);
    }
  };

  const loadServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data.services || response.data);
      console.log('✅ Services loaded successfully');
    } catch (error) {
      console.error('❌ Error loading services:', error);
      setMessage('Error loading services. Please check backend connection.');
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setMessage('Retrying connection...');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (backendStatus !== 'connected') {
      setMessage('❌ Cannot book appointment. Backend server is not connected.');
      return;
    }

    // Validate form
    if (!formData.name || !formData.phone || !formData.service_id || !formData.date || !formData.time) {
      setMessage('❌ Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await appointmentAPI.create(formData);
      setMessage('✅ Appointment booked successfully! You will receive a confirmation message.');
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        service_id: '',
        date: '',
        time: ''
      });
      
    } catch (error) {
      console.error('Booking error:', error);
      setMessage('❌ Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusConfig = () => {
    const config = {
      checking: { color: '#f59e0b', label: 'CHECKING', message: 'Checking backend connection...' },
      connected: { color: '#10b981', label: 'CONNECTED', message: 'Backend connected successfully' },
      disconnected: { color: '#ef4444', label: 'DISCONNECTED', message: 'Backend server not available' }
    };
    return config[backendStatus] || config.checking;
  };

  const statusConfig = getStatusConfig();

  // Get tomorrow's date for min date attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid #f3f4f6'
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700',
              color: '#1f2937'
            }}>
              Book Service Appointment
            </h2>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '14px', 
              color: '#6b7280' 
            }}>
              Schedule your vehicle service with AutoCare Kenya
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: statusConfig.color
            }}></div>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: statusConfig.color,
              textTransform: 'uppercase'
            }}>
              {statusConfig.label}
            </span>
          </div>
        </div>
        
        {/* Status Messages */}
        {message && (
          <div style={{ 
            padding: '16px', 
            marginBottom: '20px', 
            backgroundColor: message.includes('❌') ? '#fef2f2' : '#f0fdf4',
            color: message.includes('❌') ? '#dc2626' : '#16a34a',
            borderRadius: '8px',
            border: `1px solid ${message.includes('❌') ? '#fecaca' : '#bbf7d0'}`,
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        {/* Connection Help */}
        {backendStatus === 'disconnected' && (
          <div style={{ 
            padding: '20px', 
            marginBottom: '24px', 
            backgroundColor: '#fffbeb',
            color: '#92400e',
            borderRadius: '8px',
            border: '1px solid #fcd34d'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ fontSize: '18px' }}>🔧</div>
              <div>
                <strong style={{ display: 'block', marginBottom: '8px' }}>
                  Backend Server Not Running
                </strong>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.5' }}>
                  To start the backend server, run these commands in your terminal:
                </p>
                <code style={{ 
                  display: 'block', 
                  background: '#1f2937', 
                  color: '#f3f4f6',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  lineHeight: '1.4',
                  marginBottom: '12px'
                }}>
                  # Terminal 1 - Backend<br/>
                  cd BE<br/>
                  source venv/Scripts/activate<br/>
                  python seed_data.py<br/>
                  python app.py
                </code>
                <button
                  onClick={handleRetry}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  🔄 Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Booking Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Personal Information */}
            <div>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Personal Information
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={backendStatus !== 'connected'}
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: backendStatus === 'connected' ? 'white' : '#f9fafb',
                      opacity: backendStatus === 'connected' ? 1 : 0.7,
                      transition: 'all 0.2s'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={backendStatus !== 'connected'}
                    placeholder="+254 XXX XXX XXX"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: backendStatus === 'connected' ? 'white' : '#f9fafb',
                      opacity: backendStatus === 'connected' ? 1 : 0.7
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={backendStatus !== 'connected'}
                    placeholder="your.email@example.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: backendStatus === 'connected' ? 'white' : '#f9fafb',
                      opacity: backendStatus === 'connected' ? 1 : 0.7
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Service Details
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Select Service *
                  </label>
                  <select
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleChange}
                    required
                    disabled={backendStatus !== 'connected' || services.length === 0}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: backendStatus === 'connected' ? 'white' : '#f9fafb',
                      opacity: backendStatus === 'connected' ? 1 : 0.7,
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23333' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '8px 10px'
                    }}
                  >
                    <option value="">Choose a service...</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - KES {service.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {services.length === 0 && backendStatus === 'connected' && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                      Loading services...
                    </p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={getTomorrowDate()}
                      disabled={backendStatus !== 'connected'}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: backendStatus === 'connected' ? 'white' : '#f9fafb',
                        opacity: backendStatus === 'connected' ? 1 : 0.7
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      Preferred Time *
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      disabled={backendStatus !== 'connected'}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: backendStatus === 'connected' ? 'white' : '#f9fafb',
                        opacity: backendStatus === 'connected' ? 1 : 0.7,
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23333' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '8px 10px'
                      }}
                    >
                      <option value="">Select time...</option>
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
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              style={{
                width: '100%',
                backgroundColor: backendStatus === 'connected' ? '#2563eb' : '#9ca3af',
                color: 'white',
                padding: '14px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: backendStatus === 'connected' ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: '600',
                opacity: backendStatus === 'connected' ? 1 : 0.7,
                transition: 'all 0.2s',
                marginTop: '8px'
              }}
              disabled={loading || backendStatus !== 'connected'}
            >
              {loading ? (
                <>
                  <span style={{ marginRight: '8px' }}>⏳</span>
                  Booking Appointment...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '8px' }}>📅</span>
                  Book Appointment Now
                </>
              )}
            </button>
          </div>
        </form>

        {/* Success State */}
        {backendStatus === 'connected' && services.length > 0 && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#0369a1' }}>
              ✅ Ready to book! {services.length} services available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;