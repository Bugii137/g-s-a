import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await appointmentAPI.update(id, { status: newStatus });
      loadAppointments(); // Reload the list
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const getStatusClass = (status) => {
    const statusColors = {
      'Pending': '#ffc107',
      'Approved': '#17a2b8',
      'Completed': '#28a745',
      'Cancelled': '#dc3545'
    };
    return statusColors[status] || '#6c757d';
  };

  if (loading) {
    return <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>Loading appointments...</div>;
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2>Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Service</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Date & Time</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  <div><strong>{appointment.customer?.name}</strong></div>
                  <div>{appointment.customer?.phone}</div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  {appointment.service?.name}<br />
                  <small>KES {appointment.service?.price}</small>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  {appointment.date}<br />
                  <small>{appointment.time}</small>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  <span style={{ color: getStatusClass(appointment.status), fontWeight: 'bold' }}>
                    {appointment.status}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  {appointment.status === 'Pending' && (
                    <>
                      <button 
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          padding: '5px 10px',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          marginRight: '5px',
                          marginBottom: '5px'
                        }}
                        onClick={() => updateStatus(appointment.id, 'Approved')}
                      >
                        Approve
                      </button>
                      <button 
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          padding: '5px 10px',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                        onClick={() => updateStatus(appointment.id, 'Cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {appointment.status === 'Approved' && (
                    <button 
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                      onClick={() => updateStatus(appointment.id, 'Completed')}
                    >
                      Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentList;