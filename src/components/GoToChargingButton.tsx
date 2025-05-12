import React from 'react';
import '../css/GoToChargingButton.css'; // We will create this CSS file next

interface GoToChargingButtonProps {
  onClick: () => void; // Function to call when the button is clicked
}

const GoToChargingButton: React.FC<GoToChargingButtonProps> = ({ onClick }) => {
  return (
    <button className="charging-button" onClick={onClick}>
      Go To Charging
    </button>
  );
};

export default GoToChargingButton;