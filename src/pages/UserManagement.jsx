import React, { useState } from 'react';
import { Search, Bell, Settings, Download, Filter, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      email: 'sarah.j@curator.com',
      role: 'ADMIN',
      store: 'Central Flagship',
      status: 'Active',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Marcus Bennett',
      email: 'm.bennett@curator.com',
      role: 'MANAGER',
      store: 'Westside Boutique',
      status: 'Active',
      avatar: 'MB'
    },
    {
      id: 3,
      name: 'David Chen',
      email: 'd.chen@curator.com',
      role: 'CASHIER',
      store: 'Downtown Express',
      status: 'Away',
      avatar: 'DC'
    },
    {
      id: 4,
      name: 'Elena Rodriguez',
      email: 'e.rodriguez@curator.com',
      role: 'CASHIER',
      store: 'Central Flagship',
      status: 'Active',
      avatar: 'ER'
    },
    {
      id: 5,
      name: 'Jordan Smith',
      email: 'j.smith@curator.com',
      role: 'INVITED',
      store: 'Pending Assignment',
      status: 'Pending',
      avatar: 'JS'
    }
  ];

  const summaryCards = [
    { title: 'TOTAL EMPLOYEES', value: '42', color: '#3B82F6' },
    { title: 'STORE MANAGERS', value: '8', color: '#10B981' },
    { title: 'ACTIVE CASHIERS', value: '24', color: '#8B5CF6' },
    { title: 'PENDING INVITATIONS', value: '3', color: '#F97316' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#F0FDF4', color: '#166534' };
      case 'Away':
        return { bg: '#F9FAFB', color: '#374151' };
      case 'Pending':
        return { bg: '#FEF3C7', color: '#92400E' };
      default:
        return { bg: '#F9FAFB', color: '#374151' };
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return { bg: '#F3E8FF', color: '#7C3AED' };
      case 'MANAGER':
        return { bg: '#DBEAFE', color: '#2563EB' };
      case 'CASHIER':
        return { bg: '#F0FDF4', color: '#059669' };
      case 'INVITED':
        return { bg: '#F9FAFB', color: '#374151' };
      default:
        return { bg: '#F9FAFB', color: '#374151' };
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Navbar />
        
        <div className="page-content">
          {/* Header */}
          <div className="page-header">
            <div className="page-header-content">
              <h1 className="page-title">User Management</h1>
              <p className="page-description">
                Manage employee access levels and store assignments across your network.
              </p>
            </div>
            <button className="btn btn-primary">
              Add User
            </button>
          </div>

          {/* Summary Cards */}
          <div className="stats-grid">
            {summaryCards.map((card, index) => (
              <div key={index} className="stat-card">
                <div className="stat-content">
                  <div className="stat-info">
                    <p className="stat-label">{card.title}</p>
                    <p className="stat-value">{card.value}</p>
                  </div>
                  <div 
                    className="stat-icon"
                    style={{ backgroundColor: card.color }}
                  >
                    <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                      {card.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Team Members Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Active Team Members</h2>
              <div className="card-actions">
                <button className="btn btn-ghost">
                  <Download size={16} />
                  Export CSV
                </button>
                <button className="btn btn-ghost">
                  <Filter size={16} />
                  Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>ROLE</th>
                    <th>STORE ASSIGNED</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => {
                    const statusStyle = getStatusColor(member.status);
                    const roleStyle = getRoleColor(member.role);
                    
                    return (
                      <tr key={member.id}>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {member.avatar}
                            </div>
                            <div className="employee-info">
                              <p className="employee-name">{member.name}</p>
                              <p className="employee-email">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="role-badge"
                            style={{ 
                              backgroundColor: roleStyle.bg, 
                              color: roleStyle.color 
                            }}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="store-cell">{member.store}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ 
                              backgroundColor: statusStyle.bg, 
                              color: statusStyle.color 
                            }}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <p className="pagination-info">
                Showing 1 to 5 of 42 employees
              </p>
              <div className="pagination-controls">
                <button className="pagination-btn">
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn">2</button>
                <button className="pagination-btn">3</button>
                <button className="pagination-btn">
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="permissions-grid">
            <div className="permission-card">
              <h3 className="permission-title">Admin Permissions</h3>
              <ul className="permission-list">
                <li>Full system access</li>
                <li>User management</li>
                <li>Store configuration</li>
                <li>Financial reports</li>
              </ul>
            </div>
            <div className="permission-card">
              <h3 className="permission-title">Manager Permissions</h3>
              <ul className="permission-list">
                <li>Staff management</li>
                <li>Inventory control</li>
                <li>Sales reports</li>
                <li>Order processing</li>
              </ul>
            </div>
            <div className="permission-card">
              <h3 className="permission-title">Cashier Permissions</h3>
              <ul className="permission-list">
                <li>POS operations</li>
                <li>Product lookup</li>
                <li>Basic returns</li>
                <li>Shift reports</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
