import React from 'react';
import '../css/GoToChargingButton.css'; 

interface GoToChargingButtonProps {
  onClick: () => void; 
}

const GoToChargingButton: React.FC<GoToChargingButtonProps> = ({ onClick }) => {
  return (
    <button className="charging-button" onClick={onClick}>
      Go To Charging
    </button>
  );
};

export default GoToChargingButton;