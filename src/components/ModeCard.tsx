import React from 'react';
import '../css/ModeCard.css'; 


type ModeCardSize = 'small' | 'medium' | 'large'; 

interface ModeCardProps {
  icon: string; 
  title: string; 
  onClick: () => void; 
  size?: ModeCardSize; 
  isActive: boolean; 
}

const ModeCard: React.FC<ModeCardProps> = ({
  icon,
  title,
  onClick,
  size = 'medium', 
  isActive, 
}) => {
  
  const sizeClass = size ? `mode-card--${size}` : '';
  const iconClassName = `mode-icon mode-icon--${size}`;
  const titleClassName = `mode-title mode-title--${size}`;

  
  const activeClass = isActive ? 'mode-card--active' : '';
  

  return (
    <div
      
      className={`mode-card ${sizeClass} ${activeClass}`}
      // --- END MODIFY ---
      onClick={onClick}
    >
      <div className={iconClassName}>
        <img src={icon} alt={title} />
      </div>
      <div className={titleClassName}>{title}</div>
    </div>
  );
};

export default ModeCard;