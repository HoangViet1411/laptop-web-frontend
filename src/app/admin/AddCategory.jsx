// frontend/src/app/admin/AddCategory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
    const [category, setCategory] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('username'); // Lấy username đã lưu

    useEffect(() => {
        // Kiểm tra xem đã đăng nhập chưa (có username trong localStorage)
        if (!currentUser) {
            navigate('/login', { state: { message: "Vui lòng đăng nhập để thêm danh mục" } });
        }
        // Không cần gọi check-admin nữa, backend tự kiểm tra khi submit
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category.name.trim()) {
             setError("Tên danh mục không được để trống.");
             return;
        }
        if (!currentUser) { // Kiểm tra lại phòng trường hợp localStorage bị xóa
             setError("Lỗi: Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
             navigate('/login');
             return;
        }
        setLoading(true);
        setError(null);

        try {
            // Gắn username vào query string
            const response = await fetch(`http://localhost:5000/api/categories?username=${encodeURIComponent(currentUser)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category),
            });

             // Xử lý response từ backend
             const responseData = await response.json();

            if (!response.ok) {
                 // Ném lỗi với message từ backend nếu có
                 throw new Error(responseData.message || `Lỗi ${response.status}`);
            }

            console.log("Đã thêm danh mục:", responseData);
            navigate('/admin/categories');
        } catch (err) {
            console.error("Lỗi khi thêm danh mục:", err);
            setError(`Không thể thêm danh mục: ${err.message}`);
             setLoading(false); // Đảm bảo dừng loading khi có lỗi
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory(prevState => ({ ...prevState, [name]: value }));
    };

    // ... (Phần JSX render form giữ nguyên như trước, chỉ cần đảm bảo không còn check state isAdmin)
    // Ví dụ: bỏ các dòng check if (!isAdmin) ...

     if (error) return (
         <div className="admin-content">
             <h2>Thêm Danh Mục Mới</h2>
             <div className="error-message">Lỗi: {error}</div>
             <button onClick={() => setError(null)}>Thử lại</button>
             <button onClick={() => navigate('/admin/categories')}>Quay lại</button>
         </div>
     );

     return (
         <div className="admin-content">
             <h2>Thêm Danh Mục Mới</h2>
             <form onSubmit={handleSubmit}>
                 {/* ... các input fields ... */}
                 <div className="form-group">
                    <label htmlFor="name">Tên danh mục:</label>
                    <input id="name" type="text" name="name" value={category.name} onChange={handleChange} required />
                 </div>
                 <div className="form-group">
                    <label htmlFor="description">Mô tả:</label>
                    <textarea id="description" name="description" value={category.description} onChange={handleChange} rows="4" />
                 </div>
                 <div className="form-actions">
                     <button type="submit" disabled={loading}>
                         {loading ? 'Đang xử lý...' : 'Thêm Danh Mục'}
                     </button>
                     <button type="button" onClick={() => navigate('/admin/categories')} disabled={loading}>
                         Hủy
                     </button>
                 </div>
             </form>
         </div>
     );
}

export default AddCategory;