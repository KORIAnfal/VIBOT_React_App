import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add additional routes as your application grows */}
          <Route path="/manual-control" element={<div>Manual Control Page (Coming Soon)</div>} />
          <Route path="/tracking-mode" element={<div>Tracking Mode Page (Coming Soon)</div>} />
          <Route path="/automated-mode" element={<div>Automated Mode Page (Coming Soon)</div>} />
          <Route path="/admin-tasks" element={<div>Admin Tasks Page (Coming Soon)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
