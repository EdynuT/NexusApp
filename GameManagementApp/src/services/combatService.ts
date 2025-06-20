import { CombatAction, Initiative } from '../types';

let initiativeList: Initiative[] = [];

export const addCombatant = (name: string, initiativeScore: number) => {
    initiativeList.push({ name, initiativeScore });
    initiativeList.sort((a, b) => b.initiativeScore - a.initiativeScore);
};

export const removeCombatant = (name: string) => {
    initiativeList = initiativeList.filter(combatant => combatant.name !== name);
};

export const getInitiativeOrder = () => {
    return initiativeList;
};

export const clearCombat = () => {
    initiativeList = [];
};

export const performAction = (action: CombatAction) => {
    // Logic to handle combat actions (e.g., attack, defend, use item)
};