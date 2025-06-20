import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MasterDashboard from './components/Dashboard/MasterDashboard';
import PlayerDashboard from './components/Dashboard/PlayerDashboard';
import CampaignList from './components/Campaigns/CampaignList';
import CampaignCreate from './components/Campaigns/CampaignCreate';
import CampaignDetails from './components/Campaigns/CampaignDetails';
import CombatManager from './components/Combat/CombatManager';
import InitiativeTracker from './components/Combat/InitiativeTracker';
import PlayerSheet from './components/Sheets/PlayerSheet';
import SheetViewer from './components/Sheets/SheetViewer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/master" element={<MasterDashboard />} />
        <Route path="/dashboard/player" element={<PlayerDashboard />} />
        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/campaigns/create" element={<CampaignCreate />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path="/combat" element={<CombatManager />} />
        <Route path="/combat/initiative" element={<InitiativeTracker />} />
        <Route path="/sheets/player" element={<PlayerSheet />} />
        <Route path="/sheets/view" element={<SheetViewer />} />
      </Routes>
    </Router>
  );
};

export default App;