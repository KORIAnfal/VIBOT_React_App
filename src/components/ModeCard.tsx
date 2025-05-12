// src/components/ModeCard.tsx
import React from 'react';
import '../css/ModeCard.css'; // Import the new CSS file for the component

// Define the possible sizes for the card
type ModeCardSize = 'small' | 'medium' | 'large'; // You can define more if needed

interface ModeCardProps {
  icon: string; // Path or URL to the icon image
  title: string; // Text displayed below the icon
  onClick: () => void; // Function to call when the card is clicked
  size?: ModeCardSize; // Optional size prop, default will be handled in CSS or default prop
}

const ModeCard: React.FC<ModeCardProps> = ({
  icon,
  title,
  onClick,
  size = 'medium' // Default size if not provided
}) => {
  // Add a class based on the size prop for specific styling
  const cardClassName = `mode-card mode-card--${size}`;
  const iconClassName = `mode-icon mode-icon--${size}`;
  const titleClassName = `mode-title mode-title--${size}`;

  return (
    <div
      className={cardClassName}
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