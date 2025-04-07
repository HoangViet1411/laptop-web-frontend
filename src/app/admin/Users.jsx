// frontend/src/app/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
    const currentUser = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminAndFetchUsers = async () => {
            if (!currentUser) {
                setError('Vui lòng đăng nhập');
                setLoading(false);
                return;
            }

            try {
                const adminResponse = await fetch(`http://localhost:5000/api/auth/check-admin?username=${currentUser}`);
                if (!adminResponse.ok) throw new Error('Không thể kiểm tra quyền admin');
                const adminData = await adminResponse.json();
                if (!adminData.isAdmin) throw new Error('Chỉ admin mới có quyền xem danh sách');
                setIsAdmin(true);

                const usersResponse = await fetch(`http://localhost:5000/api/auth/users?username=${currentUser}`);
                if (!usersResponse.ok) throw new Error('Không thể tải danh sách người dùng');
                const usersData = await usersResponse.json();
                setUsers(usersData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        checkAdminAndFetchUsers();
    }, [currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/auth/users/${id}?username=${currentUser}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    const text = await response.text();
                    let errorMessage = text;
                    try {
                        const errorData = JSON.parse(text);
                        errorMessage = errorData.message || text;
                    } catch (e) {}
                    throw new Error(`Không thể xóa người dùng: ${errorMessage}`);
                }
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/auth/users?username=${currentUser}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            if (!response.ok) throw new Error('Không thể thêm người dùng');
            const addedUser = await response.json();
            setUsers([...users, addedUser]);
            setNewUser({ username: '', password: '', role: 'user' });
            setShowAddForm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi: {error}</div>;
    if (!isAdmin) return <div>Bạn không có quyền truy cập trang này.</div>;

    return (
        <div className="admin-content">
            <h2>Danh sách người dùng</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: '1rem' }}>
                {showAddForm ? 'Ẩn Form' : 'Thêm Người Dùng'}
            </button>

            {/* Form thêm user */}
            {showAddForm && (
                <form onSubmit={handleAddUser} style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit">Thêm</button>
                </form>
            )}

            {users.length === 0 ? (
                <p>Không có người dùng nào.</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>********</td>
                                <td>{user.role}</td>
                                <td>
                                    <Link to={`/admin/users/edit/${user._id}`}>
                                        <button className="edit">Edit</button>
                                    </Link>
                                    <button className="delete" onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Users;