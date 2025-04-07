import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi kết nối đến server");
                return res.json();
            })
            .then((data) => {
                setProducts(data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;

        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Lỗi khi xóa sản phẩm");

            setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));
        } catch (err) {
            alert("Không thể xóa sản phẩm! Lỗi: " + err.message);
        }
    };

    if (loading) return <p className="loading">Đang tải...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="product-list-container">
            <h2 className="product-list-title">Danh sách sản phẩm</h2>
            <Link to="/admin/products/add">
                <button className="add-product-btn">Thêm sản phẩm</button>
            </Link>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Images</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((p) => (
                            <tr key={p._id}>
                                <td>
                                    {p.image && <img src={p.image} alt={p.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} />}
                                </td>
                                <td>{p.name}</td>
                                <td>{p.price?.toLocaleString()} VND</td>
                                <td>{p.category?.name || "Chưa có danh mục"}</td>
                                <td>{p.description || "Không có mô tả"}</td>
                                <td className="action-buttons">
                                    <Link to={`/admin/products/edit/${p._id}`}>
                                        <button className="edit-btn">Sửa</button>
                                    </Link>
                                    <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="no-data">Không có sản phẩm nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;