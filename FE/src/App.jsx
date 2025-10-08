import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import LoginForm from './components/LoginForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check if user is logged in on app start
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUserRole(role || 'user');
    }
  }, []);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole('');
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (requiredRole === 'admin' && userRole !== 'admin') {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div>
          {/* Navigation */}
          <nav style={{
            backgroundColor: '#1f2937',
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
                🚗 KabHub Kenya
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link 
                  to="/" 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Home
                </Link>
                <Link 
                  to="/booking" 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Book Service
                </Link>
                
                {userRole === 'admin' && (
                  <Link 
                    to="/admin" 
                    style={{ 
                      color: 'white', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Admin
                  </Link>
                )}
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  <span>👤 {userRole}</span>
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: '1px solid white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginLeft: '10px'
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* Footer */}
          <footer style={{
            backgroundColor: '#1f2937',
            color: 'white',
            textAlign: 'center',
            padding: '2rem 0',
            marginTop: '4rem'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
              
              <p>Home of Automotive Services Across Kenya</p>
              <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '10px' }}>
              </p>
            </div>
          </footer>
        </div>
      )}
    </Router>
  );
}

export default App;