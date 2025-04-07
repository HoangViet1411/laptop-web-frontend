import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function EditCategory() {
    const [category, setCategory] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { message: "Vui lòng đăng nhập để sửa danh mục" } });
            return;
        }

        const fetchCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/api/categories/${id}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || `Lỗi ${response.status}`);
                setCategory(data);
            } catch (err) {
                console.error("Lỗi tải category:", err);
                setError(`Không thể tải thông tin danh mục: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCategory();
        } else {
            setError("ID danh mục không hợp lệ.");
            setLoading(false);
        }
    }, [id, currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category.name.trim()) {
            setError("Tên danh mục không được để trống.");
            return;
        }
        if (!currentUser) {
            setError("Lỗi: Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            navigate('/login');
            return;
        }
        setSaving(true);
        setError(null);

        try {
            const updateData = { name: category.name, description: category.description };
            const response = await fetch(`${API_URL}/api/categories/${id}?username=${encodeURIComponent(currentUser)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || `Lỗi ${response.status}`);
            }
            console.log("Đã cập nhật:", responseData);
            navigate('/admin/categories');
        } catch (err) {
            console.error("Lỗi cập nhật category:", err);
            setError(`Không thể cập nhật danh mục: ${err.message}`);
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory(prevState => ({ ...prevState, [name]: value }));
    };

    if (loading) return <div className="admin-content">Đang tải...</div>;
    if (error) return (
        <div className="admin-content">
            <h2>Chỉnh Sửa Danh Mục</h2>
            <div className="error-message">Lỗi: {error}</div>
            <button onClick={() => navigate('/admin/categories')}>Quay lại danh sách</button>
        </div>
    );
    if (!category._id && !loading) return <div className="admin-content">Không tìm thấy dữ liệu danh mục.</div>;

    return (
        <div className="admin-content">
            <h2>Chỉnh Sửa Danh Mục</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Tên danh mục:</label>
                    <input id="name" type="text" name="name" value={category.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Mô tả:</label>
                    <textarea id="description" name="description" value={category.description || ''} onChange={handleChange} rows="4" />
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={saving || loading}>
                        {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/categories')} disabled={saving || loading}>
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditCategory;