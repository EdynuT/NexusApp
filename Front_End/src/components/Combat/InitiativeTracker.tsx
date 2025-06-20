import React, { useState } from 'react';

const InitiativeTracker: React.FC = () => {
    const [initiativeOrder, setInitiativeOrder] = useState<{ name: string; initiative: number }[]>([]);
    const [currentTurn, setCurrentTurn] = useState<number>(0);

    const addCharacter = (name: string, initiative: number) => {
        setInitiativeOrder([...initiativeOrder, { name, initiative }]);
    };

    const nextTurn = () => {
        setCurrentTurn((prevTurn) => (prevTurn + 1) % initiativeOrder.length);
    };

    return (
        <div>
            <h2>Initiative Tracker</h2>
            <ul>
                {initiativeOrder.sort((a, b) => b.initiative - a.initiative).map((character, index) => (
                    <li key={index} style={{ fontWeight: currentTurn === index ? 'bold' : 'normal' }}>
                        {character.name}: {character.initiative}
                    </li>
                ))}
            </ul>
            <button onClick={nextTurn}>Next Turn</button>
            {/* Add functionality to add characters to the initiative order */}
        </div>
    );
};

export default InitiativeTracker;