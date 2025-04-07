import React from 'react';
import { useNavigate } from 'react-router-dom';
function SideBarAdmin() {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Products List', path: '/admin/products' },
        { name: 'Categories', path: '/admin/categories' },
        { name: 'Orders', path: '/admin/orders' },
        { name: 'Users', path: '/admin/users' },
    ];

    return (
        <div className="sidebar">
            <h2>Admin Menu</h2>
            {menuItems.map((item) => (
                <div
                    key={item.name}
                    className="sidebar-item"
                    onClick={() => navigate(item.path)}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
}

export default SideBarAdmin;