import React from 'react';
import { Link } from 'react-router-dom';
import CampaignList from '../Campaigns/CampaignList';
import CombatManager from '../Combat/CombatManager';
import SheetViewer from '../Sheets/SheetViewer';

const MasterDashboard: React.FC = () => {
    return (
        <div>
            <h1>Master Dashboard</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/campaigns">Manage Campaigns</Link>
                    </li>
                    <li>
                        <Link to="/combat">Manage Combat</Link>
                    </li>
                    <li>
                        <Link to="/sheets">View Player Sheets</Link>
                    </li>
                </ul>
            </nav>
            <CampaignList />
            <CombatManager />
            <SheetViewer />
        </div>
    );
};

export default MasterDashboard;