import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('username');

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/categories`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Lỗi ${response.status}`);
            setCategories(data);
        } catch (err) {
            console.error("Lỗi tải danh sách categories:", err);
            setError(`Không thể tải danh sách danh mục: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { message: "Vui lòng đăng nhập để xem danh mục" } });
            return;
        }
        fetchCategories();
    }, [currentUser, fetchCategories, navigate]);

    const handleDelete = async (id) => {
        if (!currentUser) {
            setError("Lỗi: Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            navigate('/login');
            return;
        }
        if (window.confirm(`Bạn có chắc muốn xóa danh mục này không?`)) {
            setError(null);
            try {
                const response = await fetch(`${API_URL}/api/categories/${id}?username=${encodeURIComponent(currentUser)}`, {
                    method: 'DELETE',
                });
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message || `Lỗi ${response.status}`);
                }
                setCategories(currentCategories => currentCategories.filter(category => category._id !== id));
                console.log("Đã xóa:", responseData.message);
            } catch (err) {
                console.error("Lỗi xóa category:", err);
                setError(`Không thể xóa danh mục: ${err.message}`);
            }
        }
    };

    if (loading) return <div className="admin-content">Đang tải...</div>;
    if (error) return (
        <div className="admin-content">
            <h2>Danh sách danh mục</h2>
            <div className="error-message">Lỗi: {error}</div>
            <button onClick={fetchCategories}>Thử lại</button>
            <Link to="/admin">Quay lại Dashboard</Link>
        </div>
    );

    return (
        <div className="admin-content">
            <h2>Danh sách danh mục</h2>
            <Link to="/admin/categories/add" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                <button>Thêm Danh Mục Mới</button>
            </Link>

            {categories.length === 0 ? (
                <p>Không có danh mục nào.</p>
            ) : (
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category.description || 'N/A'}</td>
                                <td>
                                    <Link to={`/admin/categories/edit/${category._id}`}>
                                        <button className="edit">Edit</button>
                                    </Link>
                                    <button className="delete" onClick={() => handleDelete(category._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Categories;