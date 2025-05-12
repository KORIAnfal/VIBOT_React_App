// src/components/Checklist.tsx
import React from 'react';
import TaskItem from './TaskItem.tsx'; // Import the individual task item component
import '../css/Checklist.css'; // CSS for the checklist container and title

interface Task {
  id: string;
  iconType: 'checked' | 'unchecked' | 'warning';
  text: string;
}

interface ChecklistProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void; // Optional handler if tasks are interactive
  icons: { // Map icon types to actual image paths
    checked: string;
    unchecked: string;
    warning: string;
  };
}

const Checklist: React.FC<ChecklistProps> = ({ tasks, onTaskClick, icons }) => {
  const getIconSrc = (iconType: Task['iconType']): string => {
    return icons[iconType] || icons.unchecked; // Default to unchecked if type is unknown
  };

  return (
    <div className="manual-checklist">
      <h3 className="manual-checklist-title">Checklist</h3>
      <div className="manual-checklist-items">
        {tasks.map(task => (
          <TaskItem
            key={task.id} // Key for list rendering
            iconSrc={getIconSrc(task.iconType)}
            text={task.text}
            onClick={() => onTaskClick && onTaskClick(task.id)} // Pass click handler if provided
          />
        ))}
      </div>
    </div>
  );
};

export default Checklist;