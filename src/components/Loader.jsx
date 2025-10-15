import React from 'react';
import '../styles/Loader.css'; 

const Loader = () => {
  return (
    <div className="loader-container">
      <img src="/logo.svg" alt="logo" className="logo-spin" />
    </div>
  );
};

export default Loader;
