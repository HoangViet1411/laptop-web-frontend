import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function EditOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({ products: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/orders/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Không thể lấy thông tin đơn hàng.");
                return res.json();
            })
            .then(data => setOrder(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            });
            if (!res.ok) throw new Error("Cập nhật đơn hàng thất bại!");
            navigate("/admin/orders");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleProductChange = (index, e) => {
        const updatedProducts = [...order.products];
        updatedProducts[index][e.target.name] = e.target.value;
        setOrder({ ...order, products: updatedProducts });
    };

    const handleAddProduct = () => {
        setOrder(prevOrder => ({
            ...prevOrder,
            products: [...prevOrder.products, { name: "", quantity: 1, price: 0 }]
        }));
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...order.products];
        updatedProducts.splice(index, 1);
        setOrder({ ...order, products: updatedProducts });
    };

    if (loading) return <p>Đang tải thông tin đơn hàng...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Chỉnh sửa đơn hàng</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên khách hàng:</label>
                    <input
                        type="text"
                        value={order.customerName || ""}
                        onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
                    />
                </div>
                <div>
                    <label>Số điện thoại:</label>
                    <input
                        type="text"
                        value={order.phone || ""}
                        onChange={(e) => setOrder({ ...order, phone: e.target.value })}
                    />
                </div>
                <div>
                    <label>Địa chỉ:</label>
                    <input
                        type="text"
                        value={order.address || ""}
                        onChange={(e) => setOrder({ ...order, address: e.target.value })}
                    />
                </div>

                <h3>Sản phẩm trong đơn hàng:</h3>
                {order.products && order.products.map((product, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                        <label>Tên sản phẩm:</label>
                        <input
                            type="text"
                            value={product.name || ""}
                            name="name"
                            onChange={(e) => handleProductChange(index, e)}
                        />
                        <label>Số lượng:</label>
                        <input
                            type="number"
                            value={product.quantity || ""}
                            name="quantity"
                            onChange={(e) => handleProductChange(index, e)}
                        />
                        <label>Giá sản phẩm:</label>
                        <input
                            type="number"
                            value={product.price || ""}
                            name="price"
                            onChange={(e) => handleProductChange(index, e)}
                        />
                        <button type="button" onClick={() => handleRemoveProduct(index)}>Xóa sản phẩm</button>
                    </div>
                ))}

                <button type="button" onClick={handleAddProduct}>Thêm sản phẩm</button>
                <button type="submit">Lưu thay đổi</button>
            </form>
        </div>
    );
}

export default EditOrder;