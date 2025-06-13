import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "../css/ManualControlMode.css"; 
import "../css/ModeCard.css";
import "../css/GoToChargingButton.css";


import Header from "../components/Header.tsx";
import RightPanel from "../components/RightPanel.tsx";
import warehouseImage from "../assets/images/wh.png";
import manualControlIcon from "../assets/images/manual_control.png";
import trackingModeIcon from "../assets/images/Tracking_mode.png";
import automatedModeIcon from "../assets/images/automated_mode.png";
import adminTasksIcon from "../assets/images/super_admin_tasks.png";


const TrackingMode = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [batteryLevel, setBatteryLevel] = useState(70); 
    const [status, setStatus] = useState("IDLE"); 

    const modeCardsData = [
      { id: "manual", icon: manualControlIcon, title: "Manual Control", path: "/manual-control" },
      { id: "tracking", icon: trackingModeIcon, title: "Tracking Mode", path: "/tracking-mode" },
      { id: "automated", icon: automatedModeIcon, title: "Automated Mode", path: "/automated-mode" },
      { id: "admin", icon: adminTasksIcon, title: "Super Admin Tasks", path: "/admin-tasks" },
    ];

    useEffect(() => {
      const batteryInterval = setInterval(() => {
        setBatteryLevel((prevLevel) => {
          const newLevel = prevLevel + (Math.random() * 2 - 1); 
          return Math.min(Math.max(Math.round(newLevel), 0), 100); 
        });
      }, 35000); 

      return () => clearInterval(batteryInterval); 
    }, []);


    useEffect(() => {
      document.body.style.position = "relative";
      return () => { document.body.style.position = ""; };
    }, []);

    const handleDisableTracking = useCallback(() => {
        console.log("Disable Tracking button clicked on New Page!");
       
    }, []); 


  
    const handleSwitchToAutoMode = useCallback(() => {
      console.log("Attempting to switch to Auto Mode from New Page");
       
       navigate("/automated-mode");
    }, [navigate]); 

    
    const handleGoToCharging = useCallback(() => {
      console.log("Sending robot to charging station from New Page");

    }, []); 

    
    const handleModeSelection = useCallback((path: string) => {
      console.log(`Switching to mode: ${path} from New Page`);
      if (location.pathname === path) { // Use location.pathname
          console.log(`Already on ${path}`);
          return;
      }
       
       navigate(path);
    }, [navigate, location.pathname]);


    return (
        <>

           <div className="manual-background-overlay"></div>
           <div className="manual-plain-background"></div>

           <div className="manual-container layout-grid">


               <div className="manual-left-panel">
                  
               </div>

               
               <div className="middle-section">

                   <Header batteryLevel={batteryLevel} status={status} />

            
                   <div className="manual-card robot-view-card">
                       <img
                           src={warehouseImage}
                           alt="Robot Camera View of Warehouse"
                           className="robot-view-image"
                       />
                   </div>

                  
                   <div className="button-container">
                       <button className="emergency-stop-button" onClick={handleDisableTracking}> 
                           Disable Tracking 
                       </button>
                       <button className="charging-button" onClick={handleSwitchToAutoMode}> 
                           Switch To Auto Mode
                       </button>
                   </div>
               </div>


               {/* --- RightPanel Component  --- */}
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

export default TrackingMode;