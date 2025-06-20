export interface User {
    id: string;
    username: string;
    email: string;
    role: 'player' | 'master';
}

export interface Campaign {
    id: string;
    name: string;
    description: string;
    masterId: string;
    players: string[];
}

export interface Combat {
    id: string;
    campaignId: string;
    participants: User[];
    turnOrder: string[];
    currentTurn: number;
}

export interface CombatAction {
    type: string;
    actor: string;
    target?: string;
    // Adicione outros campos conforme necessário
}

export interface Initiative {
    name: string;
    initiativeScore: number;
}