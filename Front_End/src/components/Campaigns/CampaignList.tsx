import React, { useEffect, useState } from 'react';
import { Campaign } from '../../types';
import { getCampaigns } from '../../services/campaignService';

const CampaignList: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await getCampaigns();
                setCampaigns(data);
            } catch (err) {
                setError('Failed to fetch campaigns');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Campaigns</h2>
            <ul>
                {campaigns.map(campaign => (
                    <li key={campaign.id}>
                        <h3>{campaign.name}</h3>
                        <p>{campaign.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CampaignList;