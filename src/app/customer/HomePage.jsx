import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Nhập toast
import SliderComponent from '../components/Slider/SliderComponent';
import SideBarCustomer from '../components/SidebarCustomer/SideBarCustomer';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search') || '';
        const categoryQuery = searchParams.get('category') || '';

        let apiUrl = '/api/products';
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (categoryQuery) params.category = categoryQuery;

        const res = await axios.get(apiUrl, { params });
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const addToCart = async (product) => {
    const userId = localStorage.getItem('username') || 'guest';
    try {
      const res = await axios.post(`/api/carts/${userId}`, {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      console.log('Added to cart:', res.data);
      toast.success(`${product.name} đã được thêm vào giỏ hàng!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Lỗi khi thêm vào giỏ hàng:', err);
      toast.error('Không thể thêm vào giỏ hàng!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="homepage-container" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <SliderComponent />
      <div className="content-container" style={{ display: 'flex', marginTop: '20px' }}>
        <div className="sidebar-and-product-list" style={{ display: 'flex', width: '100%' }}>
          <div style={{ flex: '0 0 250px' }}>
            <SideBarCustomer />
          </div>
          <div className="product-list-container" style={{ flex: 1, marginLeft: '20px' }}>
            <div className="product-list">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} className="product-card" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '200px', height: 'auto', display: 'block', marginBottom: '10px' }}
                    />
                    <h3>{product.name}</h3>
                    <p>Brand: {product.category?.name || 'Không có danh mục'}</p>
                    <p style={{ fontWeight: 'bold', color: 'blue' }}>
                      {new Intl.NumberFormat('vi-VN').format(product.price)} VND
                    </p>
                    <Link to={`/product/${product._id}`}>
                      <button style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Xem chi tiết
                      </button>
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                ))
              ) : (
                <div>Không có sản phẩm nào!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;