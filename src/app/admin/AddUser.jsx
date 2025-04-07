import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AddUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = role === 'admin' ? `${API_URL}/api/auth/register-admin` : `${API_URL}/api/auth/register`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể thêm người dùng');
      }
      navigate('/admin/users');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-content">
      <h2>Thêm Người Dùng Mới</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Thêm Người Dùng</button>
        <button type="button" onClick={() => navigate('/admin/users')}>Hủy</button>
      </form>
    </div>
  );
}

export default AddUser;