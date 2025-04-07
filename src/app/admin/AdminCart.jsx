import React, { useState, useEffect } from "react";

function AdminCart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/admin/cart")
            .then((res) => res.json())
            .then((data) => setCartItems(data))
            .catch((err) => console.error(err));
    }, []);

    const handleRemove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;

        try {
            await fetch(`http://localhost:5000/api/cart/${id}`, { method: "DELETE" });
            setCartItems(cartItems.filter(item => item._id !== id));
        } catch (error) {
            alert("Không thể xóa sản phẩm khỏi giỏ hàng!");
        }
    };

    return (
        <div>
            <h2>Quản lý Giỏ Hàng</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Tổng cộng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item._id}>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toLocaleString()} VND</td>
                            <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                            <td>
                                <button onClick={() => handleRemove(item._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminCart;