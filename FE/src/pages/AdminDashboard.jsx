import React, { useState, useEffect } from 'react';
import { serviceAPI, healthCheck } from '../services/api';
import AppointmentList from '../components/AppointmentList';
import Invoice from '../components/Invoice';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [serviceForm, setServiceForm] = useState({ name: '', price: '' });
  const [message, setMessage] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setBackendStatus('checking');
      await healthCheck();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
      setMessage('❌ Cannot connect to backend server.');
      console.error('Backend connection failed:', error);
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    try {
      await serviceAPI.create({
        name: serviceForm.name,
        price: parseFloat(serviceForm.price)
      });
      setMessage('✅ Service added successfully!');
      setServiceForm({ name: '', price: '' });
    } catch (error) {
      setMessage('❌ Error adding service');
      console.error('Error:', error);
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return '#10b981';
      case 'disconnected': return '#ef4444';
      case 'checking': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '700',
            color: '#1f2937'
          }}>
            Admin Dashboard
          </h1>
          <p style={{ 
            margin: '8px 0 0 0', 
            fontSize: '16px', 
            color: '#6b7280' 
          }}>
            Manage appointments, invoices, and services
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            padding: '6px 12px',
            backgroundColor: getStatusColor(),
            color: 'white',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {backendStatus.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '30px',
        padding: '4px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <button
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: activeTab === 'appointments' ? '#ffffff' : 'transparent',
            color: activeTab === 'appointments' ? '#1f2937' : '#6b7280',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: activeTab === 'appointments' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('appointments')}
        >
          📅 Appointments
        </button>
        <button
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: activeTab === 'invoices' ? '#ffffff' : 'transparent',
            color: activeTab === 'invoices' ? '#1f2937' : '#6b7280',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: activeTab === 'invoices' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('invoices')}
        >
          💰 Invoices
        </button>
        <button
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: activeTab === 'services' ? '#ffffff' : 'transparent',
            color: activeTab === 'services' ? '#1f2937' : '#6b7280',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: activeTab === 'services' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('services')}
        >
          🛠️ Add Service
        </button>
      </div>

      {/* Messages */}
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

      {/* Backend Connection Warning */}
      {backendStatus === 'disconnected' && (
        <div style={{ 
          padding: '20px', 
          marginBottom: '24px', 
          backgroundColor: '#fffbeb',
          color: '#92400e',
          borderRadius: '8px',
          border: '1px solid #fcd34d'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '20px' }}>⚠️</div>
            <div>
              <strong>Backend Server Not Connected</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                Please start the backend server to access admin features.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div>
        {activeTab === 'appointments' && <AppointmentList />}
        {activeTab === 'invoices' && <Invoice />}
        
        {activeTab === 'services' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ 
              margin: '0 0 24px 0', 
              fontSize: '24px', 
              fontWeight: '600',
              color: '#1f2937'
            }}>
              Add New Service
            </h2>
            
            <form onSubmit={addService}>
              <div style={{ display: 'grid', gap: '20px', maxWidth: '400px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                    required
                    disabled={backendStatus !== 'connected'}
                    placeholder="e.g., Oil Change, Brake Service"
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
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                    required
                    disabled={backendStatus !== 'connected'}
                    placeholder="1500.00"
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
                
                <button 
                  type="submit" 
                  style={{
                    width: '100%',
                    backgroundColor: backendStatus === 'connected' ? '#2563eb' : '#9ca3af',
                    color: 'white',
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: backendStatus === 'connected' ? 'pointer' : 'not-allowed',
                    fontSize: '16px',
                    fontWeight: '600',
                    opacity: backendStatus === 'connected' ? 1 : 0.7
                  }}
                  disabled={backendStatus !== 'connected'}
                >
                  ➕ Add Service
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {backendStatus === 'connected' && (
        <div style={{
          marginTop: '40px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Quick Stats
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>📅</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>Appointments</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginTop: '4px' }}>Manage All</div>
            </div>
            
            <div style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#16a34a' }}>💰</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>Invoices</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginTop: '4px' }}>Track Payments</div>
            </div>
            
            <div style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>🛠️</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>Services</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginTop: '4px' }}>Add New</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;