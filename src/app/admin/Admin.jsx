import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBarAdmin from '../components/SideBarAdmin/SideBarAdmin';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Admin({ children }) {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) return navigate('/');

        axios
            .get(`${API_URL}/api/auth/check-admin?username=${username}`)
            .then((res) => {
                if (!res.data.isAdmin) {
                    navigate('/');
                } else {
                    setIsAdmin(true);
                }
            })
            .catch(() => navigate('/'));
    }, [navigate]);

    if (!isAdmin) return null;

    return (
        <div className="admin-layout">
            <SideBarAdmin />
            <div className="admin-content">
                {children || (
                    <div className="admin-dashboard">
                        <h2>Trang Admin</h2>
                        <p>Chào mừng đến trang quản trị!</p>
                        <p>Sau này sẽ update thêm dashboard</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;