import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.tsx';
import ManualControlMode from './pages/ManualControlMode.tsx';
import TrackingMode from './pages/TrackingMode.tsx';
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
          <Route path="/automated-mode" element={<div>Automated Mode Page (Coming Soon)</div>} />
          <Route path="/admin-tasks" element={<div>Admin Tasks Page (Coming Soon)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
