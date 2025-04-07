import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OrderCustomer = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('username') || 'guest';
      try {
        const res = await axios.get(`${API_URL}/api/orders/user/${userId}`);
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy đơn hàng:', err);
        setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng!');
        setLoading(false);
        toast.error(err.response?.data?.message || 'Không thể tải danh sách đơn hàng!');
      }
    };
    fetchOrders();
  }, []);

  const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  if (loading) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Đang tải...</div>;
  if (error) return <div style={{ padding: '100px 20px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div
      style={{
        padding: '100px 20px 20px 20px',
        minHeight: 'calc(100vh - 200px)',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h2>Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào!</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: '100%', marginTop: '20px' }}
        >
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th>Ngày đặt hàng</th>
              <th>Sản phẩm</th>
              <th>Phương thức thanh toán</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  {order.products.map((product, index) => (
                    <div key={index}>
                      {product.name} (x{product.quantity}) - {product.price.toLocaleString()} VND
                    </div>
                  ))}
                </td>
                <td>{order.paymentMethod === 'cash' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua thẻ'}</td>
                <td>{new Intl.NumberFormat('vi-VN').format(calculateTotalAmount(order.products))} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderCustomer;