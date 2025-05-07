// Loader.js
import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-ring">
        <div className="loader-ring__ball"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loader;
