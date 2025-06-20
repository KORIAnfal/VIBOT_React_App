import React, { useState, useEffect, useCallback } from "react"; 
import { useNavigate, useLocation } from "react-router-dom"; 

import "../css/AutomatedMode.css"; 
import "../css/ModeCard.css"; 

import Header from "../components/Header.tsx";
import RightPanel from "../components/RightPanel.tsx"; 

import robotImage from '../assets/images/VIBOT_Image.png';
import manualControlIcon from "../assets/images/manual_control.png";
import trackingModeIcon from "../assets/images/Tracking_mode.png";
import automatedModeIcon from "../assets/images/automated_mode.png";
import adminTasksIcon from "../assets/images/super_admin_tasks.png";



const AutomatedModePage = () => { 
    const navigate = useNavigate();
    const location = useLocation(); 

    const [batteryLevel, setBatteryLevel] = useState(65); 
    const [status, setStatus] = useState("Automated"); 
    const [currentStatus, setCurrentStatus] = useState("IDLE");
    const [currentBatteryLevel, setCurrentBatteryLevel] = useState(85);

    const modeCardsData = [
      { id: "manual", icon: manualControlIcon, title: "Manual Control", path: "/manual-control" },
      { id: "tracking", icon: trackingModeIcon, title: "Tracking Mode", path: "/tracking-mode" },
      { id: "automated", icon: automatedModeIcon, title: "Automated Mode", path: "/automated-mode" },
      { id: "admin", icon: adminTasksIcon, title: "Super Admin Tasks", path: "/admin-tasks" },
    ];

    useEffect(() => {
      const batteryInterval = setInterval(() => {
        setCurrentBatteryLevel((prevLevel) => { 
          const newLevel = prevLevel + (Math.random() * 1 - 0.5); 
          return Math.min(Math.max(Math.round(newLevel), 0), 100);
        });

      }, 35000); // Update rate

      return () => clearInterval(batteryInterval); 
    }, []);


    useEffect(() => {
      document.body.style.position = "relative";
      return () => { document.body.style.position = ""; };
    }, []);

     
    const handleOnePointMission = useCallback(() => {
        navigate('/automated-mode/one-point-mission');
        
    }, []); 

   
    const handleMultiPointMission = useCallback(() => {
        navigate('/automated-mode/multi-point-mission');
    }, []); 

    const handleGoToCharging = useCallback(() => {
      console.log("Sending robot to charging station from Automated Mode Page");
     
    }, []); 

    
    const handleModeSelection = useCallback((path: string) => {
      console.log(`Switching to mode: ${path} from Automated Mode Page`);
     
      if (location.pathname === path) {
          console.log(`Already on ${path}`);
          return;
      }
       
       navigate(path);
    }, [navigate, location.pathname]); 

    return (
        <>
           <div className="manual-background-overlay"></div>
           <div className="manual-plain-background"></div>

           
           <div className="manual-container layout-grid automated-mode-page"> {/* <-- Use the new page class */}

               
               <div className="manual-left-panel">
                   
               </div>
               

               <div className="middle-section">

                   <Header batteryLevel={currentBatteryLevel} status={currentStatus} /> 
                   <div className="robot-view-card">
                       <img
                           src={robotImage} 
                           alt="Robot View in Automated Mode"
                           className="robot-view-image"
                       />
                   </div>

                   <div className="button-container">
                       
                       <button className="charging-button" onClick={handleOnePointMission}>
                           One-Point Mission
                       </button>

                       <button className="charging-button" onClick={handleMultiPointMission}>
                           Multi-Point Mission
                       </button>
                   </div>

               </div>

               <RightPanel
                  onGoToCharging={handleGoToCharging}
                  onModeSelect={handleModeSelection}
                  modeCardsData={modeCardsData} 
                  activePath={location.pathname} 
               />

           </div>
        </>
    );
};

export default AutomatedModePage; 