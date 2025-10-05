// src/components/AdminDashboard.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>AutoCare Kenya</h2>
          <p>Admin Panel</p>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link 
                to="/admin/bookings" 
                className={location.pathname.includes('/bookings') ? 'active' : ''}
              >
                📋 Bookings Management
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/reports" 
                className={location.pathname.includes('/reports') ? 'active' : ''}
              >
                📊 Reports & Analytics
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <p>Welcome, Admin</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-main-content">
        <div className="content-header">
          <h1>
            {location.pathname.includes('/bookings') && 'Bookings Management'}
            {location.pathname.includes('/reports') && 'Reports & Analytics'}
          </h1>
        </div>
        
        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;