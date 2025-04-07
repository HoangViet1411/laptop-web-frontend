import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Payments = () => {
  const [cart, setCart] = useState({ products: [] });
  const [orderInfo, setOrderInfo] = useState({
    customerName: '',
    phone: '',
    address: '',
    paymentMethod: 'cash',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem('username') || 'guest';
      try {
        const res = await axios.get(`${API_URL}/api/carts/${userId}`);
        setCart(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy giỏ hàng:', err);
        toast.error('Không thể tải giỏ hàng!');
      }
    };
    fetchCart();
  }, []);

  const totalPrice = cart.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('username') || 'guest';

    if (!orderInfo.customerName || !orderInfo.phone || !orderInfo.address) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const orderData = {
        userId,
        customerName: orderInfo.customerName,
        phone: orderInfo.phone,
        address: orderInfo.address,
        paymentMethod: orderInfo.paymentMethod,
        products: cart.products.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
      };

      const res = await axios.post(`${API_URL}/api/orders`, orderData);
      console.log('Order created:', res.data);

      await axios.delete(`${API_URL}/api/carts/${userId}`);
      setCart({ products: [] });

      toast.success('Đặt hàng thành công!');
      navigate('/');
    } catch (err) {
      console.error('Lỗi khi đặt hàng:', err);
      toast.error('Có lỗi xảy ra khi đặt hàng!');
    }
  };

  return (
    <div
      className="order-customers-container"
      style={{
        padding: '100px 20px 20px 20px',
        minHeight: 'calc(100vh - 200px)',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h2>Thông tin thanh toán</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Họ và tên:</label>
          <input
            type="text"
            name="customerName"
            value={orderInfo.customerName}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={orderInfo.phone}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={orderInfo.address}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Phương thức thanh toán:</label>
          <select
            name="paymentMethod"
            value={orderInfo.paymentMethod}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="cash">Thanh toán khi nhận hàng</option>
            <option value="card">Thanh toán qua thẻ</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <h3>Tổng tiền: {new Intl.NumberFormat('vi-VN').format(totalPrice)} VND</h3>
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Xác nhận thanh toán
        </button>
      </form>
    </div>
  );
};

export default Payments;