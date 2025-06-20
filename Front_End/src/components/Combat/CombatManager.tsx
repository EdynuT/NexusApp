import React, { useState } from 'react';

type Combatant = {
    name: string;
    initiative: number;
};

const CombatManager: React.FC = () => {
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [currentTurn, setCurrentTurn] = useState(0);

    const addCombatant = (name: string) => {
        setCombatants([...combatants, { name, initiative: Math.floor(Math.random() * 20) + 1 }]);
    };

    const nextTurn = () => {
        setCurrentTurn((prevTurn) => (prevTurn + 1) % combatants.length);
    };

    return (
        <div>
            <h1>Combat Manager</h1>
            <button onClick={() => addCombatant(prompt('Enter combatant name') || '')}>
                Add Combatant
            </button>
            <button onClick={nextTurn}>Next Turn</button>
            <h2>Current Turn: {combatants[currentTurn]?.name}</h2>
            <ul>
                {combatants.map((combatant, index) => (
                    <li key={index}>
                        {combatant.name} - Initiative: {combatant.initiative}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CombatManager;