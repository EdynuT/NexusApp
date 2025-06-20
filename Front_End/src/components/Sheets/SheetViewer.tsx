import React from 'react';
import PlayerSheet from './PlayerSheet';
import { useParams } from 'react-router-dom';

// Exemplo de tipo para os dados do personagem
type PlayerCharacter = {
    nome: string;
    raca: string;
    classe: string;
    origem: string;
    nivel: number;
    idioma: string;
    vestimentas: string;
    aparencia: string;
    idade: number;
    // ...adicione os outros campos conforme seu modelo
};

const SheetViewer: React.FC = () => {
    const { playerId } = useParams<{ playerId: string }>();

    // Simulação de busca de dados (substitua por chamada à API depois)
    const playerData: PlayerCharacter = {
        nome: 'Exemplo',
        raca: 'Humano',
        classe: 'Guerreiro',
        origem: 'Aldeia',
        nivel: 3,
        idioma: 'Comum',
        vestimentas: 'Armadura leve',
        aparencia: 'Alto, cabelo castanho',
        idade: 25,
        // ...preencha os outros campos
    };

    return (
        <div>
            <h1>Player Sheet Viewer</h1>
            <PlayerSheet playerData={playerData} />
        </div>
    );
};

export default SheetViewer;