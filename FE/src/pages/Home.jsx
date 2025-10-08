import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
        borderRadius: '10px',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          KabHub Kenya
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          Home of Automotive Services & Maintenance
        </p>
        <Link to="/booking" style={{
          backgroundColor: 'white',
          color: '#667eea',
          padding: '15px 30px',
          fontSize: '1.1rem',
          textDecoration: 'none',
          borderRadius: '25px',
          fontWeight: 'bold',
          display: 'inline-block'
        }}>
          Book Service Now
        </Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>🛠️ Our Services</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>Oil Change & Lubrication</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>Brake System Services</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>Engine Diagnostics & Repair</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>Tire Services</li>
            <li style={{ padding: '8px 0' }}>Electrical System Repair</li>
          </ul>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>📅 Easy Booking</h3>
          <p>Book your service appointment online in just a few clicks:</p>
          <ol style={{ paddingLeft: '20px' }}>
            <li>Fill out the booking form</li>
            <li>Choose your preferred date & time</li>
            <li>Select the service needed</li>
            <li>Get instant confirmation</li>
          </ol>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>📍 Locations</h3>
          <p><strong>Nairobi:</strong><br />
          Bunyala Road<br />
          Phone: +254 123 4567</p>
          
          <p><strong>Thika:</strong><br />
          Upper Road<br />
          Phone: +254 987 6543</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2>Why Choose KabHub Kenya?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4>🔧 Expert Technicians</h4>
            <p>Certified professionals with years of experience</p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4>💳 Transparent Pricing</h4>
            <p>No hidden costs, competitive rates</p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4>⏱️ Quick Service</h4>
            <p>Efficient service with minimal waiting time</p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4>🛡️ Quality Guarantee</h4>
            <p>90-day warranty on all services</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;