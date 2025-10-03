import React, { useState, useEffect } from 'react';
import { billingAPI } from '../services/api';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await billingAPI.getAll();
      setInvoices(response.data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    try {
      await billingAPI.markPaid(id);
      loadInvoices(); // Reload the list
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
    }
  };

  const getPaymentClass = (status) => {
    return status === 'Paid' ? '#28a745' : '#dc3545';
  };

  if (loading) {
    return <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>Loading invoices...</div>;
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2>Invoices</h2>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Invoice ID</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Service</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Issued Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Payment Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>INV-{invoice.id.toString().padStart(4, '0')}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{invoice.appointment?.customer?.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{invoice.appointment?.service?.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>KES {invoice.amount}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{invoice.issued_date}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  <span style={{ color: getPaymentClass(invoice.payment_status), fontWeight: 'bold' }}>
                    {invoice.payment_status}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  {invoice.payment_status === 'Unpaid' && (
                    <button 
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                      onClick={() => markAsPaid(invoice.id)}
                    >
                      Mark Paid
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

export default Invoice;