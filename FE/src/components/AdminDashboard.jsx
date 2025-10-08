import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [billing, setBilling] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedTab, setSelectedTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({ name: '', price: '', description: '' });

  // Mock data for demonstration
  const mockAppointments = [
    {
      id: 1,
      customer_name: 'John Kamau',
      service_name: 'Oil Change',
      date: '2025-01-15',
      time: '10:00 AM',
      status: 'Pending',
      vehicle_info: 'Toyota Corolla - KCA 123A',
      issue_description: 'Regular maintenance service'
    },
    {
      id: 2,
      customer_name: 'Mary Wanjiku',
      service_name: 'Brake Service',
      date: '2025-01-16',
      time: '2:00 PM',
      status: 'Approved',
      vehicle_info: 'Nissan X-Trail - KDB 456B',
      issue_description: 'Brakes making noise'
    },
    {
      id: 3,
      customer_name: 'James Ochieng',
      service_name: 'Engine Tune-up',
      date: '2025-01-17',
      time: '9:00 AM',
      status: 'Completed',
      vehicle_info: 'Subaru Forester - KCD 789C',
      issue_description: 'Engine running rough'
    }
  ];

  const mockBilling = [
    {
      id: 1,
      customer_name: 'Mary Wanjiku',
      service_name: 'Brake Service',
      amount: 4500,
      payment_status: 'Paid',
      issued_date: '2025-01-15'
    },
    {
      id: 2,
      customer_name: 'James Ochieng',
      service_name: 'Engine Tune-up',
      amount: 6000,
      payment_status: 'Unpaid',
      issued_date: '2025-01-16'
    }
  ];

  const mockServices = [
    { id: 1, name: 'Oil Change', price: 2500, description: 'Engine oil and filter change' },
    { id: 2, name: 'Brake Service', price: 4500, description: 'Brake pad replacement and inspection' },
    { id: 3, name: 'Tire Rotation', price: 1500, description: 'Tire rotation and balancing' },
    { id: 4, name: 'Engine Tune-up', price: 6000, description: 'Complete engine diagnostics and tune-up' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAppointments(mockAppointments);
      setBilling(mockBilling);
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // In real app, this would be an API call
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));

      // If approving, create billing record
      if (newStatus === 'Approved') {
        const appointment = appointments.find(apt => apt.id === appointmentId);
        const service = services.find(s => s.name === appointment.service_name);
        
        const newBill = {
          id: billing.length + 1,
          customer_name: appointment.customer_name,
          service_name: appointment.service_name,
          amount: service ? service.price : 0,
          payment_status: 'Unpaid',
          issued_date: new Date().toISOString().split('T')[0]
        };
        
        setBilling([...billing, newBill]);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const addService = () => {
    if (newService.name && newService.price) {
      const service = {
        id: services.length + 1,
        name: newService.name,
        price: parseFloat(newService.price),
        description: newService.description
      };
      setServices([...services, service]);
      setNewService({ name: '', price: '', description: '' });
    }
  };

  const updatePaymentStatus = (billId, status) => {
    setBilling(billing.map(bill => 
      bill.id === billId ? { ...bill, payment_status: status } : bill
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { background: '#fef3c7', color: '#92400e' };
      case 'Approved': return { background: '#d1fae5', color: '#065f46' };
      case 'Completed': return { background: '#dbeafe', color: '#1e40af' };
      case 'Cancelled': return { background: '#fee2e2', color: '#991b1b' };
      default: return { background: '#f3f4f6', color: '#374151' };
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'Paid' 
      ? { background: '#d1fae5', color: '#065f46' }
      : { background: '#fee2e2', color: '#991b1b' };
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 'bold', 
        marginBottom: '10px',
        color: '#1f2937'
      }}>
        Admin Dashboard
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>
        Manage appointments, billing, and services
      </p>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {['appointments', 'billing', 'services', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                padding: '12px 24px',
                backgroundColor: selectedTab === tab ? '#2563eb' : 'transparent',
                color: selectedTab === tab ? 'white' : '#6b7280',
                border: 'none',
                borderBottom: selectedTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Tab */}
      {selectedTab === 'appointments' && (
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Manage Appointments ({appointments.length})
          </h2>
          
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Customer</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Service</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Date & Time</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Vehicle</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '500' }}>{appointment.customer_name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{appointment.issue_description}</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{appointment.service_name}</td>
                    <td style={{ padding: '16px' }}>
                      <div>{appointment.date}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{appointment.time}</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{appointment.vehicle_info}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        ...getStatusColor(appointment.status)
                      }}>
                        {appointment.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {appointment.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'Approved')}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'Cancelled')}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {appointment.status === 'Approved' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Mark Complete
                        </button>
                      )}
                      {appointment.status === 'Completed' && (
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {selectedTab === 'billing' && (
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            Billing & Invoices
          </h2>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Revenue</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                KSh {billing.reduce((sum, bill) => sum + (bill.payment_status === 'Paid' ? bill.amount : 0), 0).toLocaleString()}
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Pending Payments</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                KSh {billing.reduce((sum, bill) => sum + (bill.payment_status === 'Unpaid' ? bill.amount : 0), 0).toLocaleString()}
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Invoices</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{billing.length}</div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Customer</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Service</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Amount</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Issued Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {billing.map((bill) => (
                  <tr key={bill.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{bill.customer_name}</td>
                    <td style={{ padding: '16px' }}>{bill.service_name}</td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>KSh {bill.amount.toLocaleString()}</td>
                    <td style={{ padding: '16px' }}>{bill.issued_date}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        ...getPaymentStatusColor(bill.payment_status)
                      }}>
                        {bill.payment_status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {bill.payment_status === 'Unpaid' && (
                        <button
                          onClick={() => updatePaymentStatus(bill.id, 'Paid')}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {selectedTab === 'services' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Manage Services</h2>
            <button
              onClick={() => document.getElementById('serviceModal').style.display = 'block'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Add New Service
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {services.map((service) => (
              <div key={service.id} style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{service.name}</h3>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>
                  KSh {service.price.toLocaleString()}
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {selectedTab === 'reports' && (
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>Reports & Analytics</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Appointment Statistics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Pending', 'Approved', 'Completed', 'Cancelled'].map(status => {
                  const count = appointments.filter(apt => apt.status === status).length;
                  return (
                    <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{status}:</span>
                      <span style={{ fontWeight: '600' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Revenue Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Revenue:</span>
                  <span style={{ fontWeight: '600', color: '#059669' }}>
                    KSh {billing.reduce((sum, bill) => sum + (bill.payment_status === 'Paid' ? bill.amount : 0), 0).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Outstanding:</span>
                  <span style={{ fontWeight: '600', color: '#d97706' }}>
                    KSh {billing.reduce((sum, bill) => sum + (bill.payment_status === 'Unpaid' ? bill.amount : 0), 0).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Appointments:</span>
                  <span style={{ fontWeight: '600' }}>{appointments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      <div id="serviceModal" style={{
        display: 'none',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: '1000'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '400px'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Add New Service</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Service Name</label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Price (KSh)</label>
            <input
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({...newService, price: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', height: '80px' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => document.getElementById('serviceModal').style.display = 'none'}
              style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={addService}
              style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;