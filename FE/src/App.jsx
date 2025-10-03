import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import BookingForm from './components/BookingForm';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div>
        <nav style={{
          backgroundColor: '#343a40',
          padding: '1rem 0',
          marginBottom: '2rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link 
              to="/" 
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              🚗 AutoCare Kenya
            </Link>
            
            <div>
              <Link 
                to="/" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  marginRight: '15px'
                }}
              >
                Home
              </Link>
              <Link 
                to="/booking" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  marginRight: '15px'
                }}
              >
                Book Service
              </Link>
              <Link 
                to="/admin" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none'
                }}
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <footer style={{
          backgroundColor: '#343a40',
          color: 'white',
          textAlign: 'center',
          padding: '2rem 0',
          marginTop: '4rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <p>&copy; 2024 AutoCare Kenya. All rights reserved.</p>
            <p>Professional Automotive Services Across Kenya</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;