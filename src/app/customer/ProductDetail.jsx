import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    const userId = localStorage.getItem('username') || 'guest';
    try {
      const res = await axios.post(`/api/carts/${userId}`, {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      console.log('Added to cart:', res.data);
      toast.success(`${product.name} đã được thêm vào giỏ hàng!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Lỗi khi thêm vào giỏ hàng:', err);
      toast.error('Không thể thêm vào giỏ hàng!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-page" style={{ padding: '20px' }}>
      <div className="product-detail-main-content">
        <h1>{product.name}</h1>
        <img
          src={product.image}
          alt={product.name}
          className="product-detail-image"
          style={{ width: '300px', height: 'auto', marginBottom: '20px' }}
        />
        <p><strong>Danh mục:</strong> {product.category.name}</p>
        <p>
          <strong>Giá:</strong>{' '}
          <span style={{ color: 'Blue', fontWeight: 'bold' }}>
            {new Intl.NumberFormat('vi-VN').format(product.price)} VND
          </span>
        </p>

        <div
          style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginTop: '20px',
            whiteSpace: 'pre-wrap',
            fontSize: '15px',
            lineHeight: '1.6',
            color: '#333'
          }}
        >
          <strong style={{ display: 'block', marginBottom: '10px', fontSize: '16px', textTransform: 'uppercase' }}>
            Mô tả
          </strong>
          {product.description}
        </div>

        <button
          onClick={addToCart}
          className="product-detail-button"
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
