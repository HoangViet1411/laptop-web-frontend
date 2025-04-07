import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './app/components/LoginForm/LoginForm';
import RegisterForm from './app/components/RegisterForm/RegisterForm';
import Admin from './app/admin/Admin';
import ProductsList from './app/admin/ProductsList';
import AddProduct from './app/admin/AddProduct';
import EditProduct from './app/admin/EditProduct';
import Categories from './app/admin/Categories';
import AddCategory from './app/admin/AddCategory';
import EditCategory from './app/admin/EditCategory';
import Orders from './app/admin/Orders';
import AddOrder from './app/admin/AddOrder';
import EditOrder from './app/admin/EditOrder';
import Users from './app/admin/Users';
import AddUser from './app/admin/AddUser';
import EditUser from './app/admin/EditUser';
import HeaderAdmin from './app/components/Header/HeaderAdmin';
import Footer from './app/components/Footer/Footer';
import FooterAdmin from './app/components/Footer/FooterAdmin';
import HomePage from './app/customer/HomePage';
import HeaderCustomer from './app/components/Header/HeaderCustomer';
import SideBarAdmin from './app/components/SideBarAdmin/SideBarAdmin';
import ProductDetail from './app/customer/ProductDetail';
import Cart from './app/customer/Cart';
import Payments from './app/customer/Payments'; // Đúng file đã đổi tên
import OrderCustomer from './app/customer/OrderCustomer'; // File mới cho lịch sử đơn hàng

function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div
      className={isAdminPage ? 'admin-layout' : 'customer-layout'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isAdminPage ? (
        <>
          <HeaderAdmin />
          <div className="admin-container" style={{ flex: 1 }}>
            <SideBarAdmin />
            <div className="admin-content">
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/products" element={<ProductsList />} />
                <Route path="/admin/products/add" element={<AddProduct />} />
                <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                <Route path="/admin/categories" element={<Categories />} />
                <Route path="/admin/categories/add" element={<AddCategory />} />
                <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
                <Route path="/admin/orders" element={<Orders />} />
                <Route path="/admin/orders/add" element={<AddOrder />} />
                <Route path="/admin/orders/edit/:id" element={<EditOrder />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/users/add" element={<AddUser />} />
                <Route path="/admin/users/edit/:id" element={<EditUser />} />
              </Routes>
            </div>
          </div>
          <FooterAdmin />
        </>
      ) : (
        <>
          <HeaderCustomer />
          <main
            className="main-content"
            style={{
              flex: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payments />} />
              <Route path="/orders" element={<OrderCustomer />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;