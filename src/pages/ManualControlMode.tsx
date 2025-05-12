// src/pages/ManualControlMode.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ManualControlMode.css'; // Main page layout CSS
import '../css/ModeCard.css'; // Styles for ModeCard component
import '../css/GoToChargingButton.css'; // Styles for GoToChargingButton component

import Header from '../components/Header.tsx';
import ModeCard from '../components/ModeCard.tsx'; // Import ModeCard component
import GoToChargingButton from '../components/GoToChargingButton.tsx'; // Import GoToChargingButton component

import warehouseImage from '../assets/images/wh.png';
import taskCheckedIcon from '../assets/icons/checked.svg';
import taskUncheckedIcon from '../assets/icons/unchecked.svg';
import warningIcon from '../assets/icons/warning.svg';

// Import icons needed for the ModeCards in the right panel
import manualControlIcon from '../assets/images/manual_control.png';
import trackingModeIcon from '../assets/images/Tracking_mode.png';
import automatedModeIcon from '../assets/images/automated_mode.png';
import adminTasksIcon from '../assets/images/super_admin_tasks.png';


const ManualControlPage = () => {
  const navigate = useNavigate();
  const [speed, setSpeed] = useState(50);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [status, setStatus] = useState('IDLE');


  // Mode cards data for the right panel
  const modeCardsManualPage = [
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


  // Battery level simulation
  useEffect(() => {
      const batteryInterval = setInterval(() => {
          setBatteryLevel(prevLevel => {
              const newLevel = prevLevel + (Math.random() * 2 - 1);
              return Math.min(Math.max(newLevel, 0), 100);
          });
      }, 30000);

      return () => clearInterval(batteryInterval);
  }, []);


  // Set body position for background
  useEffect(() => {
    document.body.style.position = 'relative';
    return () => {
      document.body.style.position = '';
    };
  }, []);


  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(event.target.value));
    console.log('Speed changed:', event.target.value);
  };

  const handleEmergencyStop = () => {
    console.log('Emergency Stop Activated!');
  };

  const handleSwitchToAutoMode = () => {
    console.log('Switching to Auto Mode');
    navigate('/automated-mode');
  };

  const handleModeSelection = (path: string) => {
      console.log(`Switching to mode: ${path}`);
      navigate(path);
  };

   const handleGoToCharging = () => {
     console.log('Sending robot to charging station from Manual page');
   };


  return (
    <>
      {/* Background layers */}
      <div className="manual-background-overlay"></div>
      <div className="manual-plain-background"></div>

      {/* Main content container - Use grid for the 3-column layout */}
      <div className="manual-container layout-grid">

         {/* Left Panel - Empty as requested for now */}
         {/* This div maintains the left column space in the grid */}
         <div className="manual-left-panel">
             {/* Checklist, Joystick, Speed UI go here eventually */}
         </div>

         {/* Middle Section - Header, Robot Info, Image, and main Buttons */}
         <div className="middle-section">
            {/* Header Component */}
            {/* Assuming the Header component renders something like VIBOT-2235, IDLE, Battery based on props */}
            <Header batteryLevel={batteryLevel} status={status} />

           {/* Robot View Card */}
           <div className="manual-card robot-view-card">
             <img src={warehouseImage} alt="Robot Camera View" className="robot-view-image" />
           </div>

           {/* Emergency/Auto Mode Buttons */}
           <div className="button-container">
             <button className="emergency-stop-button" onClick={handleEmergencyStop}>
               Emergency Stop
             </button>
             <button className="charging-button" onClick={handleSwitchToAutoMode}> 
               Switch To Auto Mode
             </button>
           </div>


         </div> {/* End middle-section */}

         <div className="manual-right-panel">
            <GoToChargingButton onClick={handleGoToCharging} />
            <div className="manual-mode-cards-list">
    
               {modeCardsManualPage.map((card) => (
                  <ModeCard
                    key={card.id}
                    icon={card.icon}
                    title={card.title}
                    onClick={() => handleModeSelection(card.path)}
                    size="small" 
                  />
                ))}
            </div>

           


         </div>
      </div>
    </>
  );
};

export default ManualControlPage;