import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Snowfall from 'react-snowfall';

import Home from './pages/Home';
import About from './pages/About';
import Contacts from './pages/Contacts.jsx';
import Delivery from './pages/Delivery.jsx';
import Success from './pages/Success.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Admin from './pages/Admin.jsx';
import Loader from './components/Loader.jsx';
import Cart from './pages/Cart';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import NotFound from './pages/NotFound.jsx';

import './styles/App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const snowColor = '#ffffff';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
      <>
        <Snowfall
            color={snowColor}
            snowflakeCount={150}
            style={{
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              zIndex: 1000,
            }}
        />

        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/success" element={<Success />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:id" element={<OrderDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </>
  );
}

export default App;