import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SideBarCustomer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        console.log('Categories fetched:', res.data);
        setCategories(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy danh mục:', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="sidebar-customer">
      <div className="sidebar-customer-card">
        <h3>Danh Mục</h3>
        <ul className="category-list-customer" style={{ listStyle: 'none', padding: 0 }}>
          <li className="category-item-customer" style={{ marginBottom: '10px' }}>
            <Link
              to="/"
              onClick={() => console.log('Clicked category: All')}
              style={{ textDecoration: 'none', color: '#007bff' }}
            >
              Tất cả
            </Link>
          </li>
          {categories.length > 0 ? (
            categories.map((category) => (
              <li key={category._id} className="category-item-customer" style={{ marginBottom: '10px' }}>
                <Link
                  to={`/?category=${category._id}`}
                  onClick={() => console.log('Clicked category:', category._id)}
                  style={{ textDecoration: 'none', color: '#007bff' }}
                >
                  {category.name}
                </Link>
              </li>
            ))
          ) : (
            <li>Không có danh mục!</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SideBarCustomer;