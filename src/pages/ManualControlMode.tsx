import React, { useState, useEffect, useRef, useCallback } from "react"; // useCallback is necessary for the new handlers
import { useNavigate } from "react-router-dom";
import "../css/ManualControlMode.css";
import "../css/ModeCard.css";
import "../css/GoToChargingButton.css";
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaCircle,
} from "react-icons/fa";
import Header from "../components/Header.tsx";
import ModeCard from "../components/ModeCard.tsx";
import GoToChargingButton from "../components/GoToChargingButton.tsx";

import warehouseImage from "../assets/images/wh.png";
import taskCheckedIcon from "../assets/icons/checked.svg";
import taskUncheckedIcon from "../assets/icons/unchecked.svg";
import warningIcon from "../assets/icons/warning.svg";
import manualControlIcon from "../assets/images/manual_control.png";
import trackingModeIcon from "../assets/images/Tracking_mode.png";
import automatedModeIcon from "../assets/images/automated_mode.png";
import adminTasksIcon from "../assets/images/super_admin_tasks.png";
import ROSLIB from "roslib";


// Keep ROSLIB connection setup outside the component
const ros = new ROSLIB.Ros({
  url: "ws://localhost:9090",
});

ros.on("connection", () => {
  console.log("Connected to ROSBridge");
});
ros.on("error", (error) => {
  console.error("Error connecting to ROSBridge:", error);
});
ros.on("close", () => {
  console.log("Connection to ROSBridge closed");
});

const joystickTopic = new ROSLIB.Topic({
  ros: ros,
  name: "/joystick_commands",
  messageType: "geometry_msgs/Twist",
});

const speedTopic = new ROSLIB.Topic({
  ros: ros,
  name: "/speed_cmd",
  messageType: "std_msgs/Float32",
});


const ManualControlPage = () => {
  const navigate = useNavigate();
  // --- State and Refs (Group state and refs at the top) ---
  const [speed, setSpeed] = useState(50);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [status, setStatus] = useState("IDLE");

  const speedSliderRef = useRef<HTMLInputElement>(null);

  const [checklistTasks, setChecklistTasks] = useState([
    { id: 1, text: "Task 01", status: "unchecked" },
    { id: 2, text: "Task 02", status: "unchecked" },
    { id: 3, text: "Task 03", status: "unchecked" },
    { id: 4, text: "Task 04", status: "unchecked" },
    { id: 5, text: "Task 05", status: "unchecked" },
  ]);

  // Joystick State and Refs
  const [thumbstickPosition, setThumbstickPosition] = useState({ x: 0, y: 0 });
  const joystickAreaRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const centerPos = useRef({ x: 0, y: 0 });
  const radius = useRef(0);
  // --- End State and Refs ---


  // Mode cards data (Place data before effects or handlers)
  const modeCardsManualPage = [
    {
      id: "manual", icon: manualControlIcon, title: "Manual Control", path: "/manual-control",
    },
    {
      id: "tracking", icon: trackingModeIcon, title: "Tracking Mode", path: "/tracking-mode",
    },
    {
      id: "automated", icon: automatedModeIcon, title: "Automated Mode", path: "/automated-mode",
    },
    {
      id: "admin", icon: adminTasksIcon, title: "Super Admin Tasks", path: "/admin-tasks",
    },
  ];


  // --- Callback Functions (Declare these before useEffects if effects depend on them) ---

  // NEW: Modified handleJoystickControl to accept linear/angular velocities
  const handleJoystickControl = useCallback((linear_x: number, angular_z: number) => {
      if (!ros.isConnected) {
          // console.warn("ROSBridge not connected. Command not sent.");
          return;
      }
       const twist = new ROSLIB.Message({
         linear: { x: linear_x, y: 0, z: 0 },
         angular: { x: 0, y: 0, z: angular_z },
       });
       joystickTopic.publish(twist);
  }, []); // No dependencies needed for the function itself


  // NEW: Drag Event Handlers using useCallback
  // Declare handleDragging and handleDragEnd before handleDragStart because handleDragStart uses them
  const handleDragging = useCallback((e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !joystickAreaRef.current || radius.current <= 0) {
          return;
      }

      let currentX, currentY;
      if ('touches' in e) {
          if (e.touches.length === 0) return;
          currentX = e.touches[0].clientX;
          currentY = e.touches[0].clientY;
          e.preventDefault(); // Prevent touch scroll/zoom
      } else {
          currentX = e.clientX;
          currentY = e.clientY;
      }

      const deltaX = currentX - centerPos.current.x;
      const deltaY = currentY - centerPos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      let newX = deltaX;
      let newY = deltaY;

      if (distance > radius.current) {
          const angle = Math.atan2(deltaY, deltaX);
          newX = radius.current * Math.cos(angle);
          newY = radius.current * Math.sin(angle);
      }

      setThumbstickPosition({ x: newX, y: newY });
      // Command publishing is handled by the interval effect
  }, []); // No dependencies needed for this specific calculation logic


  const handleDragEnd = useCallback(() => {
      isDragging.current = false;

      window.removeEventListener('mousemove', handleDragging);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragging as EventListener, { passive: false } as any);
      window.removeEventListener('touchend', handleDragEnd);
      window.removeEventListener('touchcancel', handleDragEnd);

      setThumbstickPosition({ x: 0, y: 0 }); // Reset position
      handleJoystickControl(0, 0); // Send stop command
  }, [handleDragging, handleJoystickControl]); // Dependencies on other handlers


   const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
       isDragging.current = true;

       // Add global listeners
       window.addEventListener('mousemove', handleDragging);
       window.addEventListener('mouseup', handleDragEnd);
       window.addEventListener('touchmove', handleDragging as EventListener, { passive: false });
       window.addEventListener('touchend', handleDragEnd);
       window.addEventListener('touchcancel', handleDragEnd); // Good practice to include

       // Calculate dimensions and initial position immediately on start
       if (joystickAreaRef.current) {
           const rect = joystickAreaRef.current.getBoundingClientRect();
           centerPos.current = {
               x: rect.left + rect.width / 2,
               y: rect.top + rect.height / 2,
           };
           const thumbRadius = 30; // Half the thumbstick size
           radius.current = (rect.width / 2) - thumbRadius;
       }
       // Process the initial click/touch position to potentially move the thumbstick immediately
       // This needs a MouseEvent/TouchEvent type, so we might need a cast or adjust types
       // For simplicity, let's process the initial position calculation in handleDragging
       // Call handleDragging immediately after adding listeners
       handleDragging(e as any); // Cast needed for type compatibility with MouseEvent | TouchEvent parameter

       e.preventDefault(); // Prevent default browser behavior (text selection, scrolling)

   }, [handleDragging, handleDragEnd]); // Dependencies on other drag handlers


    // Handle checklist item click to cycle status
  const handleChecklistItemClick = useCallback((clickedId: number) => {
      setChecklistTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === clickedId) {
            let newStatus = "unchecked";
            if (task.status === "unchecked") {
              newStatus = "checked";
            } else if (task.status === "checked") {
              newStatus = "warning";
            }
            return { ...task, status: newStatus };
          }
          return task;
        })
      );
        console.log(`Task ${clickedId} status cycled`);
  }, []); // If setChecklistTasks is stable from React, [] is okay. Otherwise include it.


  // Handle speed slider change (Convert to useCallback for consistency)
  const handleSpeedChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(event.target.value);
    setSpeed(newSpeed); // Update state, effect updates CSS var
    console.log("Speed changed:", newSpeed);
    // Publish to ROS (if connected)
    if (ros.isConnected) {
       speedTopic.publish(new ROSLIB.Message({ data: newSpeed / 100.0 }));
    } else {
        console.warn("ROSBridge not connected. Speed command not sent.");
    }
  }, [setSpeed, ros.isConnected, speedTopic]); // Dependencies

   // Handle Emergency Stop button click (Convert to useCallback)
  const handleEmergencyStop = useCallback(() => {
    console.log("Emergency Stop Activated!");
    // Send stop command using the consistent handler
    handleJoystickControl(0, 0);
    // TODO: Add more robust emergency stop logic if needed (e.g., service call)
  }, [handleJoystickControl]); // Depends on handleJoystickControl


  // Handle Switch to Auto Mode button click (Convert to useCallback)
  const handleSwitchToAutoMode = useCallback(() => {
    console.log("Switching to Auto Mode");
     // TODO: Add API call or ROS command to switch mode BEFORE navigating
     navigate("/automated-mode");
  }, [navigate]); // Depends on navigate


  // Handle Mode Card selection (Convert to useCallback)
  const handleModeSelection = useCallback((path: string) => {
    console.log(`Switching to mode: ${path}`);
    // window.location.pathname is a global property, doesn't need dependency
    if (window.location.pathname === path) {
        console.log(`Already on ${path}`);
        return;
    }
     // TODO: Add API call or ROS command to switch mode BEFORE navigating
     navigate(path);
  }, [navigate]); // Depends on navigate


  // Handle Go To Charging button click (Convert to useCallback)
  const handleGoToCharging = useCallback(() => {
    console.log("Sending robot to charging station from Manual page");
    // TODO: Add API call or ROS command
  }, []); // No external dependencies


  // Function to determine task icon based on status (Convert to useCallback - optional but good practice)
  // This is a pure function, so dependencies are []
  const getTaskIcon = useCallback((status: "checked" | "warning" | "unchecked") => {
    switch (status) {
      case "checked": return taskCheckedIcon;
      case "warning": return warningIcon;
      case "unchecked": return taskUncheckedIcon;
      default: return taskUncheckedIcon;
    }
  }, []); // No dependencies

  // --- End Callback Functions ---


  // --- Effects (Group these after callbacks if they depend on them) ---

   // NEW: Effect for continuous ROS command publishing
    useEffect(() => {
        let publishInterval: NodeJS.Timeout | null = null;
        const publishRate = 50; // milliseconds (e.g., 20 Hz)

        const startPublishing = () => {
            if (publishInterval === null) {
                publishInterval = setInterval(() => {
                    // Calculate command based on current thumbstick position
                    // Access state/refs directly or via dependencies
                    const max_speed_factor = speed / 100.0;
                    const linear_x_cmd = -thumbstickPosition.y / radius.current * max_speed_factor * 0.5;
                    const angular_z_cmd = -thumbstickPosition.x / radius.current * max_speed_factor * 0.8;

                    handleJoystickControl(linear_x_cmd, angular_z_cmd);

                }, publishRate);
                 console.log(`Started publishing interval @ ${publishRate}ms`);
            }
        };

        const stopPublishing = () => {
            if (publishInterval !== null) {
                clearInterval(publishInterval);
                publishInterval = null;
                 console.log("Stopped publishing interval");
            }
        };

        // Only publish when dragging is active
        if (isDragging.current) {
             startPublishing();
        } else {
             stopPublishing();
             // Final stop command sent in handleDragEnd
        }

        return () => {
            stopPublishing(); // Clean up interval on component unmount or when isDragging becomes false
        };
    }, [isDragging.current, thumbstickPosition, speed, handleJoystickControl]); // Depend on state/refs/callbacks used inside

  // --- End Effects ---


  // --- Return JSX (This part stays at the very end) ---
  return (
    <>
      {/* Background elements */}
      <div className="manual-background-overlay"></div>
      <div className="manual-plain-background"></div>

      <div className="manual-container layout-grid">

        {/* Left Panel */}
        <div className="manual-left-panel">

          {/* Checklist Block */}
          <div className="manual-checklist-block">
            <h3>Checklist</h3>
            <div className="manual-card checklist-items ">
              {checklistTasks.map((task) => (
                <div
                    key={task.id}
                    className={`checklist-item ${task.status}`}
                    onClick={() => handleChecklistItemClick(task.id)}
                >
                  <img
                    src={getTaskIcon(task.status as any)} // Cast needed for status prop
                    alt={`${task.text} status icon`}
                    className="task-icon"
                  />
                  <span className="task-text">{task.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* --- Joystick Control Section --- */}
          <div className="manual-joystick-block">
            {/* This div is the large outer circle area. Attach ref and drag start listeners */}
            <div
                className="joystick-grid"
                ref={joystickAreaRef}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
            >
              {/* Directional buttons are ONLY visual indicators now. Removed onClick. */}
              <button
                className="joystick-button up"
                aria-label="Move Up"
              >
                <FaChevronUp />
              </button>
              <button
                className="joystick-button left"
                 aria-label="Turn Left"
              >
                <FaChevronLeft />
              </button>

              {/* --- Draggable Thumbstick Element --- */}
              {/* Position dynamically based on thumbstickPosition state */}
              <div
                 className="joystick-thumb"
                 style={{
                    transform: `translate(${thumbstickPosition.x}px, ${thumbstickPosition.y}px)`,
                 }}
              >
                  {/* The white dot icon inside the thumbstick */}
                  <FaCircle className="joystick-thumb-dot" />
              </div>
               {/* --- END Draggable Thumbstick --- */}

              <button
                className="joystick-button right"
                 aria-label="Turn Right"
              >
                <FaChevronRight />
              </button>
              <button
                className="joystick-button down"
                 aria-label="Move Down"
              >
                <FaChevronDown />
              </button>
            </div>
          </div>
          {/* --- END Joystick Control Section --- */}


          {/* Speed Slider Section */}
          <div className="speed-control">
            <span>Speed</span>
            <input
              type="range"
              min="0"
              max="100"
              value={speed}
              onChange={handleSpeedChange} // This now calls the useCallback version
              className="speed-slider"
              aria-label={`Speed: ${speed}%`}
              ref={speedSliderRef} // Attach the ref
            />
          </div>

        </div>

        {/* Middle Section */}
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
            <button
              className="emergency-stop-button"
              onClick={handleEmergencyStop} // This now calls the useCallback version
            >
              Emergency Stop
            </button>
            <button
              className="switch-mode-button"
              onClick={handleSwitchToAutoMode} // This now calls the useCallback version
            >
              Switch To Auto Mode
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="manual-right-panel">
          <GoToChargingButton onClick={handleGoToCharging} /> {/* This now calls the useCallback version */}
          <div className="manual-mode-cards-list">
            {modeCardsManualPage.map((card) => (
              <ModeCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                onClick={() => handleModeSelection(card.path)} // This now calls the useCallback version
                size="small"
                isActive={window.location.pathname === card.path}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManualControlPage;