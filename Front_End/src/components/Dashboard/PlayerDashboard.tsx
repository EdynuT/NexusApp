import React from 'react';
import { useEffect, useState } from 'react';
import { getCampaigns } from '../../services/campaignService';
import { Campaign } from '../../types';

const PlayerDashboard: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await getCampaigns();
                setCampaigns(data);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Your Campaigns</h1>
            {campaigns.length === 0 ? (
                <p>You are not part of any campaigns.</p>
            ) : (
                <ul>
                    {campaigns.map(campaign => (
                        <li key={campaign.id}>
                            <h2>{campaign.name}</h2>
                            <p>{campaign.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlayerDashboard;