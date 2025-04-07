import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Cấu hình API_URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AddOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({
    customerName: "",
    phone: "",
    address: "",
    paymentMethod: "cash",
    productId: "",
    quantity: 1,
    products: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`); // Sử dụng API_URL
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", err);
        alert("Không thể tải danh sách sản phẩm.");
      }
    };
    fetchProducts();
  }, []);

  const addProductToOrder = () => {
    if (!order.productId || order.quantity < 1) return;

    const product = products.find((p) => p._id === order.productId);
    if (product) {
      const newProduct = {
        name: product.name,
        price: product.price,
        quantity: order.quantity,
      };
      setOrder({
        ...order,
        products: [...order.products, newProduct],
        productId: "",
        quantity: 1,
      });
    } else {
      alert("Sản phẩm không tồn tại.");
    }
  };

  const removeProductFromOrder = (index) => {
    const updatedProducts = [...order.products];
    updatedProducts.splice(index, 1);
    setOrder({ ...order, products: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!order.customerName || !order.phone || !order.address) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng.");
      return;
    }

    const totalAmount = order.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    const orderToSend = {
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      paymentMethod: order.paymentMethod,
      products: order.products,
      totalAmount: totalAmount,
    };

    try {
      const res = await axios.post(`${API_URL}/api/orders`, orderToSend); // Sử dụng API_URL
      console.log("Đơn hàng đã được thêm:", res.data);
      navigate("/admin/orders");
    } catch (error) {
      console.error("Lỗi khi thêm đơn hàng:", error);
      alert("Thêm đơn hàng thất bại!");
    }
  };

  return (
    <div>
      <h2>Thêm đơn hàng</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên khách hàng"
          value={order.customerName}
          onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "300px" }}
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={order.phone}
          onChange={(e) => setOrder({ ...order, phone: e.target.value })}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "300px" }}
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={order.address}
          onChange={(e) => setOrder({ ...order, address: e.target.value })}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "300px" }}
        />
        <select
          value={order.paymentMethod}
          onChange={(e) => setOrder({ ...order, paymentMethod: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "300px" }}
        >
          <option value="cash">Thanh toán khi nhận hàng</option>
          <option value="card">Thanh toán qua thẻ</option>
        </select>
        <select
          value={order.productId}
          onChange={(e) => setOrder({ ...order, productId: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "300px" }}
        >
          <option value="">Chọn sản phẩm</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={order.quantity}
          onChange={(e) =>
            setOrder({ ...order, quantity: Math.max(1, parseInt(e.target.value)) })
          }
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "300px" }}
        />
        <button
          type="button"
          onClick={addProductToOrder}
          style={{ padding: "8px 16px", margin: "10px 0" }}
        >
          Thêm sản phẩm
        </button>
        <div>
          <h4>Sản phẩm đã chọn:</h4>
          <ul>
            {order.products.map((product, index) => (
              <li key={index}>
                {product.name} - {product.quantity} x {product.price} VND
                <button
                  type="button"
                  onClick={() => removeProductFromOrder(index)}
                  style={{ marginLeft: "10px", background: "red", color: "white" }}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Tổng tiền: {order.products.reduce((total, product) => total + product.price * product.quantity, 0)} VND</h4>
        </div>
        <button
          type="submit"
          style={{ padding: "10px 20px", background: "#28a745", color: "white" }}
        >
          Thêm đơn hàng
        </button>
      </form>
    </div>
  );
}

export default AddOrder;
