import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampaign } from '../../services/campaignService';
import { Campaign } from '../../types'; // Ajuste o tipo se necessário

const CampaignCreate: React.FC = () => {
    const [campaignName, setCampaignName] = useState('');
    const [description, setDescription] = useState('');
    const [masterId, setMasterId] = useState('');
    const [players, setPlayers] = useState<string>(''); // IDs separados por vírgula
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const campaign: Campaign = {
                id: '',
                name: campaignName,
                description,
                masterId,
                players: players.split(',').map(p => p.trim()).filter(Boolean),
            };
            await createCampaign(campaign);
            navigate('/campaigns');
        } catch (error) {
            console.error('Failed to create campaign:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="campaignName">Campaign Name:</label>
                <input
                    type="text"
                    id="campaignName"
                    value={campaignName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCampaignName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="masterId">Master ID:</label>
                <input
                    type="text"
                    id="masterId"
                    value={masterId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMasterId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="players">Players (comma separated IDs):</label>
                <input
                    type="text"
                    id="players"
                    value={players}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayers(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create Campaign</button>
        </form>
    );
};

export default CampaignCreate;