// src/components/TaskItem.tsx
import React from 'react';
import '../css/TaskItem.css'; // CSS for a single task item

interface TaskItemProps {
  iconSrc: string; // Path to the icon image
  text: string;    // The task description
  onClick?: () => void; // Optional click handler for the task item
}

const TaskItem: React.FC<TaskItemProps> = ({ iconSrc, text, onClick }) => {
  return (
    <div className="task-item" onClick={onClick}>
      <img src={iconSrc} alt="" className="task-item-icon" />
      <span className="task-item-text">{text}</span>
    </div>
  );
};

export default TaskItem;