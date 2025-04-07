import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function EditUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/users?username=${currentUser}`);
        if (!response.ok) throw new Error('Không thể tải thông tin người dùng');
        const users = await response.json();
        const user = users.find(u => u._id === id);
        if (!user) throw new Error('Người dùng không tồn tại');
        setUsername(user.username);
        setRole(user.role);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, [id, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { username, role };
      if (password) updateData.password = password;

      const response = await fetch(`${API_URL}/api/auth/users/${id}?username=${currentUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể cập nhật người dùng');
      }
      navigate('/admin/users');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-content">
      <h2>Chỉnh Sửa Người Dùng</h2>
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
          <label>Password (để trống nếu không thay đổi):</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Lưu Thay Đổi</button>
        <button type="button" onClick={() => navigate('/admin/users')}>Hủy</button>
      </form>
    </div>
  );
}

export default EditUser;