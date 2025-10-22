import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'admin',
    shift: 'all',
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          station_id: 'pc-a' // Will be dynamic
        })
      });

      if (response.ok) {
        setShowForm(false);
        setEditingUser(null);
        setFormData({
          username: '',
          password: '',
          full_name: '',
          role: 'admin',
          shift: 'all',
          phone: '',
          email: ''
        });
        loadUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save user');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // Don't show password
      full_name: user.full_name,
      role: user.role,
      shift: user.shift,
      phone: user.phone || '',
      email: user.email || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete user');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      supervisor: '#e74c3c',
      admin: '#3498db',
      doctor: '#2ecc71',
      nurse: '#f39c12',
      staff: '#95a5a6'
    };
    return colors[role] || '#95a5a6';
  };

  const getShiftColor = (shift) => {
    const colors = {
      pagi: '#f39c12',
      siang: '#e67e22',
      malam: '#34495e',
      all: '#27ae60'
    };
    return colors[shift] || '#95a5a6';
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingUser(null);
            setFormData({
              username: '',
              password: '',
              full_name: '',
              role: 'admin',
              shift: 'all',
              phone: '',
              email: ''
            });
            setShowForm(true);
          }}
        >
          Add New User
        </button>
      </div>

      {showForm && (
        <div className="user-form-overlay">
          <div className="user-form-modal">
            <div className="form-header">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setShowForm(false)} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    disabled={editingUser}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="full_name">Full Name</label>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="shift">Shift</label>
                  <select
                    id="shift"
                    value={formData.shift}
                    onChange={(e) => setFormData({...formData, shift: e.target.value})}
                    required
                  >
                    <option value="all">All Shifts</option>
                    <option value="pagi">Morning</option>
                    <option value="siang">Afternoon</option>
                    <option value="malam">Night</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    placeholder="Enter password"
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <h3 className="user-name">{user.full_name}</h3>
            </div>
            
            <div className="user-badges">
              <span 
                className="badge-outlined role-badge"
                style={{ color: getRoleColor(user.role), borderColor: getRoleColor(user.role) }}
              >
                {user.role.toUpperCase()}
              </span>
              <span 
                className="badge-outlined shift-badge"
                style={{ color: getShiftColor(user.shift), borderColor: getShiftColor(user.shift) }}
              >
                {user.shift.toUpperCase()}
              </span>
            </div>
            
            <div className="user-actions">
              <button 
                onClick={() => handleEdit(user)}
                className="action-link edit-link"
              >
                edit
              </button>
              <button 
                onClick={() => handleDelete(user.id)}
                className="action-link delete-link"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="no-users">
          <p>No users found. Add your first user to get started.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
