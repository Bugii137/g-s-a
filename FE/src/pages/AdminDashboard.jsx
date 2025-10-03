import React, { useState } from 'react';
import AppointmentList from '../components/AppointmentList';
import Invoice from '../components/Invoice';
import { serviceAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [serviceForm, setServiceForm] = useState({ name: '', price: '' });
  const [message, setMessage] = useState('');

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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button
          style={{
            backgroundColor: activeTab === 'appointments' ? '#007bff' : '#6c757d',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button
          style={{
            backgroundColor: activeTab === 'invoices' ? '#007bff' : '#6c757d',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
        </button>
        <button
          style={{
            backgroundColor: activeTab === 'services' ? '#007bff' : '#6c757d',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('services')}
        >
          Add Service
        </button>
      </div>

      {activeTab === 'appointments' && <AppointmentList />}
      {activeTab === 'invoices' && <Invoice />}
      
      {activeTab === 'services' && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Add New Service</h2>
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
          <form onSubmit={addService}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Service Name</label>
              <input
                type="text"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price (KES)</label>
              <input
                type="number"
                step="0.01"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <button type="submit" style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Add Service
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;