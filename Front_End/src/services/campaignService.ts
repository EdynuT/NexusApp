import { Campaign } from '../types';

const campaigns: Campaign[] = [];

export const createCampaign = (campaign: Campaign) => {
    campaigns.push(campaign);
    return campaign;
};

export const getCampaigns = () => {
    return campaigns;
};

export const getCampaignById = (id: string) => {
    return campaigns.find(campaign => campaign.id === id);
};

export const updateCampaign = (id: string, updatedCampaign: Partial<Campaign>) => {
    const index = campaigns.findIndex(campaign => campaign.id === id);
    if (index !== -1) {
        campaigns[index] = { ...campaigns[index], ...updatedCampaign };
        return campaigns[index];
    }
    return null;
};