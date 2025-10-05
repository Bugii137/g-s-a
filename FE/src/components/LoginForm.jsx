import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple authentication - in real app, this would call an API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple demo authentication
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        onLogin('admin');
      } else if (credentials.username === 'user' && credentials.password === 'user123') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'user');
        onLogin('user');
      } else {
        setError('Invalid username or password. Try admin/admin123 or user/user123');
      }
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            🚗
          </div>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            AutoCare Kenya
          </h1>
          <p style={{
            margin: 0,
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Demo Credentials */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            fontWeight: '600',
            color: '#0369a1'
          }}>
            Demo Credentials:
          </h4>
          <div style={{ fontSize: '12px', color: '#0c4a6e', lineHeight: '1.5' }}>
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>User:</strong> user / user123</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#374151',
              fontSize: '14px'
            }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#374151',
              fontSize: '14px'
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Signing in...
              </>
            ) : (
              <>
                <span style={{ marginRight: '8px' }}>🔐</span>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Need an account?{' '}
            <span style={{
              color: '#2563eb',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Contact administrator
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;