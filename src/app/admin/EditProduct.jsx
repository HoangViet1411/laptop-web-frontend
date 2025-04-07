import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function EditProduct() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/api/categories`)
            .then((res) => res.json())
            .then(setCategories)
            .catch(() => setError("Không thể tải danh mục."));
        
        fetch(`${API_URL}/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setName(data.name);
                setPrice(data.price);
                setCategory(data.category?._id || "");
                setDescription(data.description);
            })
            .catch(() => setError("Không thể tải sản phẩm."));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!name || !price || !category || !description) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("description", description);
        if (image) formData.append("image", image);

        fetch(`${API_URL}/api/products/${id}`, {
            method: "PUT",
            body: formData
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    setError(data.message);
                } else {
                    navigate("/admin/products");
                }
            })
            .catch(() => setError("Lỗi kết nối đến server."));
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2>Chỉnh sửa sản phẩm</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <button type="submit">Lưu</button>
        </form>
    );
}

export default EditProduct;