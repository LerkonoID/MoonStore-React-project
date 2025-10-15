import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contacts from './pages/Contacts.jsx';
import Delivery from './pages/Delivery.jsx';
import Success from './pages/Success.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Loader from './components/Loader.jsx';
import Cart from './pages/Cart';
import Footer from './components/Footer.jsx';   
import Header from './components/Header.jsx';
import { CartContext } from './context/CartContext.jsx';
import './styles/App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const { totalItems, totalPrice } = useContext(CartContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
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
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
