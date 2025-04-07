import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Thay fetch bằng axios để đồng bộ với các file khác

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders"); // Sử dụng axios
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể lấy danh sách đơn hàng!");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;

    try {
      await axios.delete(`/api/orders/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
    } catch (error) {
      alert("Xóa đơn hàng thất bại!");
    }
  };

  const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  if (loading) return <p>Đang tải danh sách đơn hàng...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>
      <Link to="/admin/orders/add">
        <button>Thêm đơn hàng</button>
      </Link>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", marginTop: "10px" }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Tên khách hàng</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Phương thức thanh toán</th> {/* Thêm cột mới */}
            <th>Ngày đặt hàng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => {
              const totalAmount = calculateTotalAmount(order.products);

              return (
                <tr key={order._id}>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{order.address}</td>
                  <td>
                    {order.paymentMethod === "cash"
                      ? "Thanh toán khi nhận hàng"
                      : "Thanh toán qua thẻ"}
                  </td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    {order.products.map((product, index) => (
                      <div key={index}>
                        {product.name} (x{product.quantity}) -{" "}
                        {product.price.toLocaleString()} VND
                      </div>
                    ))}
                  </td>
                  <td>{parseFloat(totalAmount).toLocaleString()} VND</td>
                  <td>
                    <button
                      onClick={() => handleDelete(order._id)}
                      style={{
                        marginLeft: "5px",
                        background: "red",
                        color: "white",
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="8" // Cập nhật colspan để khớp số cột
                style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}
              >
                Không có đơn hàng nào!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;