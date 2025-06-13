import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/AdminTask.css"; 
import "../css/ModeCard.css";
import "../css/GoToChargingButton.css";

import Header from "../components/Header.tsx";
import RightPanel from "../components/RightPanel.tsx";

import taskCheckedIcon from "../assets/icons/checked.svg";
import taskUncheckedIcon from "../assets/icons/unchecked.svg";
import manualControlIcon from "../assets/images/manual_control.png";
import trackingModeIcon from "../assets/images/Tracking_mode.png";
import automatedModeIcon from "../assets/images/automated_mode.png";
import adminTasksIcon from "../assets/images/super_admin_tasks.png";

// Assuming ROSLIB is used globally or imported/setup elsewhere if needed here


const AdminTaskPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Kept 'location' as is based on your code

    const [batteryLevel, setBatteryLevel] = useState(65);
    const [status, setStatus] = useState("Automated");

    const [zones, setZones] = useState([
        { id: 1, text: "zone E > Stop 2/3 > 14 Paracetamol boxes", status: "unchecked" },
        { id: 2, text: "Zone D > Stop 2/3 > 3 Smecta Boxes", status: "unchecked" },
        { id: 3, text: "Zone C", status: "unchecked" },
        { id: 4, text: "Zone D", status: "unchecked" },
        { id: 5, text: "Zone E", status: "unchecked" },
        { id: 6, text: "Zone F", status: "unchecked" },
        { id: 7, text: "Zone G", status: "unchecked" },
        { id: 8, text: "Zone H", status: "unchecked" },
        { id: 9, text: "Zone I", status: "unchecked" },
        { id: 10, text: "Zone J", status: "unchecked" },
        { id: 11, text: "Zone K", status: "unchecked" },
        { id: 12, text: "Zone L", status: "unchecked" },
        { id: 13, text: "Zone M", status: "unchecked" },
    ]);

    const progressBarRef = useRef<HTMLDivElement>(null);

    const modeCardsData = useMemo(() => [
      { id: "manual", icon: manualControlIcon, title: "Manual Control", path: "/manual-control" },
      { id: "tracking", icon: trackingModeIcon, title: "Tracking Mode", path: "/tracking-mode" },
      { id: "automated", icon: automatedModeIcon, title: "Automated Mode", path: "/automated-mode" },
      { id: "admin", icon: adminTasksIcon, title: "Super Admin Tasks", path: "/admin-tasks" },
    ], [manualControlIcon, trackingModeIcon, automatedModeIcon, adminTasksIcon]); // Memoize data and list asset imports


    const { currentMissionText, progressPercentage } = useMemo(() => {
        const totalZones = zones.length;
        const checkedZones = zones.filter(zone => zone.status === 'checked').length;

        const percentage = totalZones > 0 ? (checkedZones / totalZones) * 100 : 0;

        // Find the first unchecked zone for the current mission text
        const firstUncheckedZone = zones.find(zone => zone.status === 'unchecked');
        // Display the next task text or 'Mission Complete'
        const missionText = firstUncheckedZone
            ? `${firstUncheckedZone.text}` // Display only the text of the next zone
            : 'Mission Complete';

         // Format the "Current Mission" text as "Current mission: Zone X"
         const fullMissionText = firstUncheckedZone ? `Current mission: ${missionText}` : missionText;


        return {
            currentMissionText: fullMissionText,
            progressPercentage: percentage,
        };
    }, [zones]); // Recalculate whenever the zones state changes


    // --- Effects ---

    // Battery level simulation
    useEffect(() => {
      const batteryInterval = setInterval(() => {
        setBatteryLevel((prevLevel) => {
          const newLevel = prevLevel + (Math.random() * 1 - 0.5); // Slower fluctuation
          return Math.min(Math.max(Math.round(newLevel), 0), 100);
        });
      }, 35000);

      return () => clearInterval(batteryInterval);
    }, []);

    // Set body position for background
    useEffect(() => {
      document.body.style.position = "relative";
      return () => { document.body.style.position = ""; };
    }, []);

     // Effect to update progress bar fill CSS variable
     useEffect(() => {
         if (progressBarRef.current) {
             progressBarRef.current.style.setProperty('--progress-percentage', `${progressPercentage}%`);
         }
     }, [progressPercentage]);


    // --- Callback Functions ---

    // Handler for the Emergency Stop button
    const handleEmergencyStop = useCallback(() => {
        console.log("Emergency Stop button clicked on Automated Mode Page!");
        // TODO: Add API call or ROS command to stop the robot immediately
    }, []);


    // Handler for the "Go To Charging" button (Pass to RightPanel)
    const handleGoToCharging = useCallback(() => {
      console.log("Sending robot to charging station from Automated Mode Page");
      // TODO: Add API call or ROS command
    }, []);

    // Handler for Mode Card selection (Pass to RightPanel)
    const handleModeSelection = useCallback((path: string) => {
      console.log(`Switching to mode: ${path} from Automated Mode Page`);

      if (location.pathname === path) {
          console.log(`Already on ${path}`);
          return;
      }
       // TODO: Add API call or ROS command to switch mode BEFORE navigating
       navigate(path);
    }, [navigate, location.pathname]);

    // Function to determine task icon based on status
    const getTaskIcon = useCallback((status: 'checked' | 'warning' | 'unchecked') => {
      switch (status) {
        case 'checked': return taskCheckedIcon;
        case 'unchecked': return taskUncheckedIcon;
        default: return taskUncheckedIcon; // Fallback
      }
    }, [taskCheckedIcon, taskUncheckedIcon]); // Dependencies on imported icons


    // --- MODIFY: handleZoneItemClick to toggle status and ADD scrollability CSS ---
    const handleZoneItemClick = useCallback((clickedId: number) => {
        setZones(prevZones =>
            prevZones.map(zone => {
                 if (zone.id === clickedId) {
                     let newStatus = 'unchecked'; // Default to unchecked
                     if (zone.status === 'unchecked') {
                         newStatus = 'checked'; 
                     }
                     
                     return { ...zone, status: newStatus };
                 }
                 return zone; // Return unchanged for other zones
            })
        );
        // TODO: Optionally send status update to ROS or backend
        console.log(`Zone ${clickedId} status toggled`);
    }, []); // Dependencies: setZones (stable)
   


    return (
        <>
           {/* Background elements (Copy these) */}
           <div className="manual-background-overlay"></div>
           <div className="manual-plain-background"></div>

           {/* Add the specific page class to the main container */}
           <div className="manual-container layout-grid automated-mode-page">

               {/* --- Left Panel (Empty or specific Automated Mode controls) --- */}
               <div className="manual-left-panel">

               </div>
               {/* --- END Empty Left Panel --- */}

               {/* --- Middle Section (Build structure based on image) --- */}
               <div className="middle-section">
                   {/* Header component needs battery and status */}
                   <Header batteryLevel={batteryLevel} status={status} />

                   {/* Container for current mission status (text and progress bar) */}
                   <div className="current-mission-status">
                       <span className="current-mission-text">{currentMissionText}</span> {/* Display calculated text */}
                       {/* Progress bar */}
                       <div className="mission-progress-bar"> {/* Outer container for the bar */}
                           {/* The fill part */}
                           <div className="mission-progress-bar-fill" ref={progressBarRef}></div> {/* Add ref here */}
                       </div>
                   </div>

                   <div className="manual-card checklist-items scrollable-list"> {/* ADD scrollable-list class */}
                       {/* List items */}
                       {zones.map(zone => (
                           <div
                               key={zone.id}
                               className={`checklist-item ${zone.status}`}
                               onClick={() => handleZoneItemClick(zone.id)} // Use the handler
                            >
                               <img
                                   src={getTaskIcon(zone.status as any)} // Use getTaskIcon for icon
                                   alt={`${zone.text} status icon`}
                                   className="task-icon"
                               />
                               {/* Use flex-grow on the text span to push content */}
                               <span className="task-text">{zone.text}</span>
                           </div>
                       ))}
                   </div>
 
                   <div className="button-container"> {/* Use button-container for spacing */}
                       <button className="emergency-stop-button" onClick={handleEmergencyStop}> {/* Use the dedicated handler */}
                           Emergency Stop {/* Keep the text as per image */}
                       </button>

                   </div>



               </div>
               {/* --- END Middle Section --- */}

               {/* --- Use the RightPanel Component --- */}
               <RightPanel
                  onGoToCharging={handleGoToCharging}
                  onModeSelect={handleModeSelection}
                  modeCardsData={modeCardsData}
                  activePath={location.pathname} // Pass the current path
               />

           </div>
        </>
    );
};

export default AdminTaskPage;