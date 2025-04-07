// src/app/customer/HeaderCustomer.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

function HeaderCustomer() {
  const [username, setUsername] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/');
    window.location.reload();
  };

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/?search=${searchQuery}`);
    }
  };

  return (
    <header
      className="header-customer"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: '#343a40',
        position: 'fixed', // Đảm bảo header cố định trên cùng
        top: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      {/* Logo + Tên */}
      <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ height: '60px', marginRight: '1rem' }} />
        <Link
          to="/"
          className="logo"
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
          }}
        >
          Laptop Vk
        </Link>
      </div>

      {/* Thanh tìm kiếm */}
      <div
        className="header-center"
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0px',
        }}
      >
        <div style={{ display: 'flex', height: '38px' }}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              height: '100%',
              width: '300px',
              padding: '0 10px',
              border: '1px solid #ccc',
              borderRadius: '4px 0 0 4px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              height: '100%',
              padding: '0 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Giỏ hàng + Đơn hàng + User */}
      <div className="header-right" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/cart" className="icon-button" style={{ marginRight: '20px', color: 'white' }}>
          <FaShoppingCart size={24} />
        </Link>
        {username ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to="/orders"
              style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}
            >
              Đơn hàng
            </Link>
            <span className="user-name" style={{ color: 'white', marginRight: '10px' }}>
              {username}
            </span>
            <button
              onClick={handleLogout}
              className="logout-button"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link to="/login" className="icon-button" style={{ color: 'white' }}>
            <FaUser size={24} />
          </Link>
        )}
      </div>
    </header>
  );
}

export default HeaderCustomer;