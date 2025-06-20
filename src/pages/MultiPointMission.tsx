import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/MultiPointMission.css";
import "../css/ModeCard.css";
import "../css/GoToChargingButton.css";
import Header from "../components/Header.tsx";
import RightPanel from "../components/RightPanel.tsx";
import taskCheckedIcon from "../assets/icons/checked.svg";
import taskUncheckedIcon from "../assets/icons/unchecked.svg";
import warningIcon from "../assets/icons/warning.svg";
import manualControlIcon from "../assets/images/manual_control.png";
import trackingModeIcon from "../assets/images/Tracking_mode.png";
import automatedModeIcon from "../assets/images/automated_mode.png";
import adminTasksIcon from "../assets/images/super_admin_tasks.png";


const MultiPointMission = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [batteryLevel, setBatteryLevel] = useState(85);
    const [status, setStatus] = useState("IDLE");

    const [leftChecklistItems, setLeftChecklistItems] = useState([
        { id: 1, text: "Items 01", status: "checked" },
        { id: 2, text: "Items 02", status: "warning" },
        { id: 3, text: "Items 03", status: "unchecked" },
        { id: 4, text: "Items 04", status: "unchecked" },
    ]);

    const [zones, setZones] = useState([
        { id: 1, text: "zone E > Stop 2/3 > 14 Paracetamol boxes", status: "checked" },
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
    ], [manualControlIcon, trackingModeIcon, automatedModeIcon, adminTasksIcon]);


    const { currentMissionText, progressPercentage } = useMemo(() => {
        const totalZones = zones.length;
        const checkedZones = zones.filter(zone => zone.status === 'checked').length;

        const percentage = totalZones > 0 ? (checkedZones / totalZones) * 100 : 0;

        const firstUncheckedZone = zones.find(zone => zone.status === 'unchecked');
        const missionText = firstUncheckedZone
            ? `${firstUncheckedZone.text}`
            : 'Mission Complete';

         const fullMissionText = firstUncheckedZone ? `Current mission: ${missionText}` : missionText;


        return {
            currentMissionText: fullMissionText,
            progressPercentage: percentage,
        };
    }, [zones]);


    useEffect(() => {
      const batteryInterval = setInterval(() => {
        setBatteryLevel((prevLevel) => {
          const newLevel = prevLevel + (Math.random() * 1 - 0.5);
          return Math.min(Math.max(Math.round(newLevel), 0), 100);
        });
      }, 35000);

      return () => clearInterval(batteryInterval);
    }, []);

    useEffect(() => {
      document.body.style.position = "relative";
      return () => { document.body.style.position = ""; };
    }, []);

     useEffect(() => {
         if (progressBarRef.current) {
             progressBarRef.current.style.setProperty('--progress-percentage', `${progressPercentage}%`);
         }
     }, [progressPercentage]);


    const handleLeftChecklistItemClick = useCallback((clickedId: number, currentStatus: string) => {
      setLeftChecklistItems(prevItems =>
        prevItems.map(item => {
          if (item.id === clickedId) {
            let newStatus = "unchecked";
            if (currentStatus === "unchecked") {
              newStatus = "checked";
            } else if (currentStatus === "checked") {
              newStatus = "warning";
            }
            return { ...item, status: newStatus };
          }
          return item;
        })
      );
       console.log(`Left Checklist Item ${clickedId} status cycled`);
    }, []);


    const handleZoneItemClick = useCallback((clickedId: number) => {
        setZones(prevZones =>
            prevZones.map(zone => {
                 if (zone.id === clickedId) {
                     let newStatus = 'unchecked';
                     if (zone.status === 'unchecked') {
                         newStatus = 'checked';
                     }
                     return { ...zone, status: newStatus };
                 }
                 return zone;
            })
        );
        console.log(`Zone ${clickedId} status toggled`);
    }, []);


    const handleEmergencyStop = useCallback(() => {
        console.log("Emergency Stop button clicked on Multi-Point Mission Page!");
    }, []);

    const handleCancelNextPoint = useCallback(() => {
        console.log("Cancel Next Point button clicked!");
         setZones(prevZones => {
             const firstUncheckedIndex = prevZones.findIndex(zone => zone.status === 'unchecked');
             if (firstUncheckedIndex !== -1) {
                 const newZones = [...prevZones];
                 newZones[firstUncheckedIndex] = { ...newZones[firstUncheckedIndex], status: 'warning' };
                 return newZones;
             }
             return prevZones;
         });
    }, []);


    const handleGoToCharging = useCallback(() => {
      console.log("Sending robot to charging station from Multi-Point Mission Page");
    }, []);

    const handleModeSelection = useCallback((path: string) => {
      console.log(`Switching to mode: ${path} from Multi-Point Mission Page`);
      if (location.pathname === path) {
          console.log(`Already on ${path}`);
          return;
      }
       navigate(path);
    }, [navigate, location.pathname]);

    const getTaskIcon = useCallback((status: 'checked' | 'warning' | 'unchecked') => {
      switch (status) {
        case 'checked': return taskCheckedIcon;
        case 'warning': return warningIcon;
        case 'unchecked': return taskUncheckedIcon;
        default: return taskUncheckedIcon;
      }
    }, [taskCheckedIcon, warningIcon, taskUncheckedIcon]);


    return (
        <>
           <div className="manual-background-overlay"></div>
           <div className="manual-plain-background"></div>

           <div className="manual-container layout-grid multi-point-mission-page">

               <div className="manual-left-panel">
                   <div className="manual-checklist-block">
                       
                       <div className="manual-card checklist-items">
                           {leftChecklistItems.map(item => (
                               <div
                                   key={item.id}
                                   className={`checklist-item ${item.status}`}
                                   onClick={() => handleLeftChecklistItemClick(item.id, item.status)}
                                >
                                   <img
                                       src={getTaskIcon(item.status as any)}
                                       alt={`${item.text} status icon`}
                                       className="task-icon"
                                   />
                                   <span className="task-text">{item.text}</span>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>

               <div className="middle-section">
                   <Header batteryLevel={batteryLevel} status={status} />

                   <div className="current-mission-status">
                       <span className="current-mission-text">{currentMissionText}</span>
                       <div className="mission-progress-bar">
                           <div className="mission-progress-bar-fill" ref={progressBarRef}></div>
                       </div>
                   </div>

                   <div className="manual-card checklist-items scrollable-list">
                       {zones.map(zone => (
                           <div
                               key={zone.id}
                               className={`checklist-item ${zone.status}`}
                               onClick={() => handleZoneItemClick(zone.id)}
                            >
                               <img
                                   src={getTaskIcon(zone.status as any)}
                                   alt={`${zone.text} status icon`}
                                   className="task-icon"
                               />
                               <span className="task-text">{zone.text}</span>
                           </div>
                       ))}
                   </div>

                   <div className="button-container">
                       <button className="emergency-stop-button" onClick={handleEmergencyStop}>
                           Emergency Stop
                       </button>
                       <button className="cancel-button" onClick={handleCancelNextPoint}>
                           Cancel Next Point
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

export default MultiPointMission;