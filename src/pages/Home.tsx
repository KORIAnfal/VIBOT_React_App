import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/home.css'; 
import '../css/ModeCard.css'; 
import '../css/GoToChargingButton.css';
import robotImage from '../assets/images/VIBOT_Image.png';

// Import components
import ModeCard from '../components/ModeCard.tsx';
import GoToChargingButton from '../components/GoToChargingButton.tsx';
import Header from '../components/Header.tsx';
import manualControlIcon from '../assets/images/manual_control.png';
import trackingModeIcon from '../assets/images/Tracking_mode.png';
import automatedModeIcon from '../assets/images/automated_mode.png';
import adminTasksIcon from '../assets/images/super_admin_tasks.png';



const HomePage = () => {
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [status, setStatus] = useState('IDLE');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.position = 'relative';
    return () => {
      document.body.style.position = '';
    };
  }, []);

  // Mode cards data (still needed here to provide data to the map)
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

  const handleModeSelection = (path: string) => {
    navigate(path);
  };

  const handleGoToCharging = () => {
    console.log('Sending robot to charging station');
  };

  return (
    <>
      {/* Background layers */}
      <div className="background-overlay"></div>
      <div className="galaxy-background"></div>

      <div className="home-container">
        <Header batteryLevel={batteryLevel} status={status} />

        <div className="robot-container">
          <img src={robotImage} alt="VIBOT Robot" className="robot-image" />
        </div>

        <div className="control-modes">
          {modeCards.map((card) => (
            <ModeCard
              key={card.id} 
              icon={card.icon}
              title={card.title}
              onClick={() => handleModeSelection(card.path)}
              size="medium" // Specify the size for the home page
            />
          ))}
        </div>

        <div className="charging-container">
          <GoToChargingButton onClick={handleGoToCharging} />
        </div>
      </div>
    </>
  );
};

export default HomePage;