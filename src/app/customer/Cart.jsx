import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Cart = () => {
  const [cart, setCart] = useState({ products: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem('username') || 'guest';
      try {
        const res = await axios.get(`${API_URL}/api/carts/${userId}`);
        setCart(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy giỏ hàng:', err);
      }
    };
    fetchCart();
  }, []);

  const increaseQuantity = async (productId) => {
    const userId = localStorage.getItem('username') || 'guest';
    const product = cart.products.find((p) => p.productId.toString() === productId);
    if (!product) return;

    try {
      const res = await axios.put(`${API_URL}/api/carts/${userId}`, {
        productId,
        quantity: product.quantity + 1,
      });
      setCart(res.data);
    } catch (err) {
      console.error('Lỗi khi tăng số lượng:', err);
    }
  };

  const decreaseQuantity = async (productId) => {
    const userId = localStorage.getItem('username') || 'guest';
    const product = cart.products.find((p) => p.productId.toString() === productId);
    if (!product || product.quantity <= 1) return;

    try {
      const res = await axios.put(`${API_URL}/api/carts/${userId}`, {
        productId,
        quantity: product.quantity - 1,
      });
      setCart(res.data);
    } catch (err) {
      console.error('Lỗi khi giảm số lượng:', err);
    }
  };

  const removeFromCart = async (productId) => {
    const userId = localStorage.getItem('username') || 'guest';
    try {
      const res = await axios.delete(`${API_URL}/api/carts/${userId}/${productId}`);
      setCart(res.data.cart);
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
    }
  };

  const totalPrice = cart.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate('/payment');
  };

  if (cart.products.length === 0) {
    return (
      <div
        className="cart-empty"
        style={{
          padding: '100px 20px',
          textAlign: 'center',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <h2>Giỏ hàng của bạn trống!</h2>
        <Link to="/">Quay lại mua sắm</Link>
      </div>
    );
  }

  return (
    <div
      className="cart-container"
      style={{
        padding: '100px 20px 20px 20px',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <h2>Giỏ hàng</h2>
      <div className="cart-items">
        {cart.products.map((item) => (
          <div
            key={item.productId}
            className="cart-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #ddd',
              padding: '10px 0',
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '100px', height: 'auto', marginRight: '20px' }}
            />
            <div style={{ flex: 1 }}>
              <h3>{item.name}</h3>
              <p>Giá: {new Intl.NumberFormat('vi-VN').format(item.price)} VND</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => decreaseQuantity(item.productId)}
                  style={{ padding: '5px 10px', marginRight: '10px' }}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.productId)}
                  style={{ padding: '5px 10px', marginLeft: '10px' }}
                >
                  +
                </button>
              </div>
            </div>
            <p style={{ fontWeight: 'bold' }}>
              Tổng: {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} VND
            </p>
            <button
              onClick={() => removeFromCart(item.productId)}
              style={{
                padding: '5px 10px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                marginLeft: '20px',
                cursor: 'pointer',
              }}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <h3>Tổng tiền: {new Intl.NumberFormat('vi-VN').format(totalPrice)} VND</h3>
        <button
          onClick={handleCheckout}
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;