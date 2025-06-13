import React from 'react';
import GoToChargingButton from './GoToChargingButton.tsx'; 
import ModeCard from './ModeCard.tsx'; 
import '../css/ManualControlMode.css';


interface ModeCardData {
  id: string;
  icon: string;
  title: string;
  path: string;
}

interface RightPanelProps {

  onGoToCharging: () => void; 
  onModeSelect: (path: string) => void; 
  modeCardsData: ModeCardData[]; 
  activePath: string; 
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
            onClick={() => onModeSelect(card.path)} 
            size="small" 
            isActive={activePath === card.path} 
          />
        ))}
      </div>
    </div>
  );
};

export default RightPanel;