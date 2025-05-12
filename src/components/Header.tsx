import React from 'react';
import '../css/home.css';
import viLogo from '../assets/images/VI_logo.png';

interface HeaderProps {
  batteryLevel: number;
  status: string;
}

const Header: React.FC<HeaderProps> = ({ batteryLevel, status }) => {
  return (
    <>
      <div className="top-logo-container">
        <img src={viLogo} alt="VI Logo" className="vi-logo" />
      </div>
      
      <div className="bot-info-section">
        <h1 className="bot-name">VIBOT-2235</h1>
        <div className="status-container">
          <span className="status-text">{status}</span>
          <span className="battery-indicator">
            <span
              className="battery-dot"
              style={{ backgroundColor: batteryLevel > 20 ? '#4caf50' : '#f44336' }}
            ></span>
            <span className="battery-text">{Math.round(batteryLevel)}%</span>
          </span>
        </div>
      </div>
    </>
  );
};

export default Header;
