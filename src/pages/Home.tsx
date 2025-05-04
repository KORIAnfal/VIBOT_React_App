import React, { useState, useEffect } from 'react';
import '../css/home.css';
import robotImage from '../assets/images/VIBOT_Image.png'; 
import viLogo from '../assets/images/VI_logo.png';
import galaxyBackground from '../assets/images/Galaxy_effect.png'; // Import galaxy background
import manualControlIcon from '../assets/images/manual_control.png';
import trackingModeIcon from '../assets/images/Tracking_mode.png';
import automatedModeIcon from '../assets/images/automated_mode.png';
import adminTasksIcon from '../assets/images/super_admin_tasks.png';

const HomePage = () => {
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [status, setStatus] = useState('IDLE');
  
  // Galaxy background style
  const galaxyStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '70%',
    backgroundImage: `url(${galaxyBackground})`,
    backgroundSize: '100% 100% ',
    backgroundPosition: 'top center',
    opacity: 0.7,
    zIndex: -1,
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#050510', // Dark blue-black background
    zIndex: -2,
  };
  
  useEffect(() => {
    document.body.style.position = 'relative';
    return () => {
      document.body.style.position = '';
    };
  }, []);

  // Mode cards data
  const modeCards = [
    {
      id: 'manual',
      icon: manualControlIcon,
      title: 'Manual Control',
      path: '/manual-control',
    },
    {
      id: 'tracking',
      icon: trackingModeIcon,
      title: 'Tracking Mode',
      path: '/tracking-mode',
    },
    {
      id: 'automated',
      icon: automatedModeIcon,
      title: 'Automated Mode',
      path: '/automated-mode',
    },
    {
      id: 'admin',
      icon: adminTasksIcon,
      title: 'Super Admin Tasks',
      path: '/admin-tasks',
    },
  ];

  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prevLevel => {
        const newLevel = prevLevel + (Math.random() * 2 - 1);
        return Math.min(Math.max(newLevel, 0), 100);
      });
    }, 30000); 

    return () => clearInterval(batteryInterval);
  }, []);

  const handleModeSelection = (path) => {
    console.log(`Navigating to ${path}`);
  };

  const handleGoToCharging = () => {
    console.log('Sending robot to charging station');
  };

  return (
    <>
      {/* Dark overlay for better contrast */}
      <div style={overlayStyle}></div>
      
      {/* Galaxy Background */}
      <div style={galaxyStyle}></div>
      
      <div className="home-container">
        <div className="top-logo-container">
          <img src={viLogo} alt="VI Logo" className="vi-logo" />
        </div>
        
        <div className="bot-info-section">
          <h1 className="bot-name">VIBOT-2235</h1>
          <div className="status-container">
            <span className="status-text">{status}</span>
            <span className="battery-indicator">
              <span className="battery-dot" style={{ backgroundColor: batteryLevel > 20 ? '#4caf50' : '#f44336' }}></span>
              <span className="battery-text">{Math.round(batteryLevel)}%</span>
            </span>
          </div>
        </div>

        <div className="robot-container">
          <img src={robotImage} alt="VIBOT Robot" className="robot-image" />
        </div>

        <div className="control-modes">
          {modeCards.map((card) => (
            <div 
              key={card.id} 
              className="mode-card" 
              onClick={() => handleModeSelection(card.path)}
            >
              <div className="mode-icon">
                <img src={card.icon} alt={card.title} />
              </div>
              <div className="mode-title">{card.title}</div>
            </div>
          ))}
        </div>

        <div className="charging-container">
          <button className="charging-button" onClick={handleGoToCharging}>
            Go To Charging
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;