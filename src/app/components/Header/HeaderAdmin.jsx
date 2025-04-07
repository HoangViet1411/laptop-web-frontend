import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Icon user đẹp
import logo from '../../assets/images/logo.png';

function HeaderAdmin() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                color: 'white', // chữ trắng
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
                <img src={logo} alt="Logo" style={{ height: '60px', marginRight: '1rem' }} />
                <h1 style={{ margin: 0 }}>Laptop VK</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {username ? (
                    <>
                        <FaUserCircle size={24} color="white" />
                        <span style={{ fontSize: '13px' }}>{username}</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '0.5rem',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: 'white',
                            }}
                        >
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.5rem',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: 'white',
                        }}
                    >
                        Đăng xuất
                    </button>
                )}
            </div>
        </header>
    );
}

export default HeaderAdmin;
