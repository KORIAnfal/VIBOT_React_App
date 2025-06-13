import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.tsx';
import ManualControlMode from './pages/ManualControlMode.tsx';
import TrackingMode from './pages/TrackingMode.tsx';
import AdminTask from './pages/AdminTask.tsx';
import AutomatedMode from './pages/AutomatedMode.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add additional routes as your application grows */}
          <Route path="/manual-control" element={<ManualControlMode/>} />
          <Route path="/tracking-mode" element={<TrackingMode/>} />
          <Route path="/automated-mode" element={<AutomatedMode/>} />
          <Route path="/admin-tasks" element={<AdminTask/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
