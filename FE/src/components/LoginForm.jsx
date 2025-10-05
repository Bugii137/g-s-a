import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login logic
        // For demo purposes - in real app, this would call your backend
        if (formData.email === 'admin@autocare.com' && formData.password === 'admin123') {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'admin');
          onLogin('admin');
        } else if (formData.email && formData.password) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'user');
          onLogin('user');
        } else {
          setMessage('Invalid email or password');
        }
      } else {
        // Registration logic
        // For demo purposes - in real app, this would call your backend
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', formData.role);
        onLogin(formData.role);
        setMessage('Registration successful!');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#1f2937',
        fontSize: '28px',
        fontWeight: 'bold'
      }}>
        {isLogin ? 'Login to AutoCare' : 'Create Account'}
      </h2>
      
      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '6px',
          backgroundColor: message.includes('error') ? '#fee2e2' : '#d1fae5',
          color: message.includes('error') ? '#dc2626' : '#065f46',
          border: `1px solid ${message.includes('error') ? '#fecaca' : '#a7f3d0'}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Account Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="user">Customer</option>
                <option value="admin">Administrator</option>
              </select>
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Note: Admin accounts require special permissions
              </small>
            </div>
          </>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
            minLength="6"
          />
          <small style={{ color: '#6b7280', fontSize: '12px' }}>
            Password must be at least 6 characters long
          </small>
        </div>

        {!isLogin && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleSwitchMode}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </button>
      </div>

      {/* Demo Credentials */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        <strong>Demo Credentials:</strong><br />
        Admin: admin@autocare.com / admin123<br />
        User: any email with any password (6+ characters)
      </div>
    </div>
  );
};

export default LoginForm;