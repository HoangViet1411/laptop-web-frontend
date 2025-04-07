import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function AdminProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => setProduct(data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!product) {
        return <p>Đang tải...</p>;
    }

    return (
        <div>
            <h2>Chi tiết sản phẩm</h2>
            <p><strong>Tên sản phẩm:</strong> {product.name}</p>
            <p><strong>Giá:</strong> {product.price.toLocaleString()} VND</p>
            <p><strong>Mô tả:</strong> {product.description}</p>
            <p><strong>Danh mục:</strong> {product.category}</p>
            <p><strong>Tồn kho:</strong> {product.stock}</p>
            <img src={product.imageUrl} alt={product.name} width="200" />
            <br />
            <Link to="/admin/products"><button>Quay lại</button></Link>
            <Link to={`/admin/products/edit/${product._id}`}><button>Sửa</button></Link>
        </div>
    );
}

export default AdminProductDetail;