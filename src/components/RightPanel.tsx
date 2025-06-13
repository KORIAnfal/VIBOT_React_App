import React from 'react';
import GoToChargingButton from './GoToChargingButton.tsx'; // Adjust path if needed
import ModeCard from './ModeCard.tsx'; // Adjust path if needed
import '../css/ManualControlMode.css'; // Import main CSS for styling consistency


interface ModeCardData {
  id: string;
  icon: string;
  title: string;
  path: string;
}

interface RightPanelProps {
  // Props needed for this component
  onGoToCharging: () => void; // Function to call when Go To Charging is clicked
  onModeSelect: (path: string) => void; // Function to call when a Mode Card is clicked
  modeCardsData: ModeCardData[]; // Array of data for mode cards
  activePath: string; // The currently active route path for highlighting
}

const RightPanel: React.FC<RightPanelProps> = ({
  onGoToCharging,
  onModeSelect,
  modeCardsData,
  activePath
}) => {
  return (
    <div className="manual-right-panel">
      {/* Go To Charging Button - Uses the component */}
      <GoToChargingButton onClick={onGoToCharging} />

      {/* Mode Cards List */}
      <div className="manual-mode-cards-list">
        {modeCardsData.map((card) => (
          <ModeCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            onClick={() => onModeSelect(card.path)} // Use the prop function
            size="small" // Assuming size prop is supported by ModeCard
            isActive={activePath === card.path} // Pass active state based on prop
          />
        ))}
      </div>
    </div>
  );
};

export default RightPanel;