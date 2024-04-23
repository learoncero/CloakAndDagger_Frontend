import React from 'react';
import { Player } from "@/app/types";

type Props = {
    map: string[][];
    playerList: Player[];
    closeMiniMap: () => any;
    currentPlayer: Player;
};

const MiniMap: React.FC<Props> = ({ map, playerList, currentPlayer }: Props) => {
    if (!map) {
        return <div>Can not show Minimap right now</div>;
    }


    const viewRadius = 5;
    const { x, y } = currentPlayer.position;

    return (
        <div className="MapDisplay-map-container minimap-container">
            {map.map((row, rowIndex) => (
                <div key={rowIndex} className="MapDisplay-row">
                    {row.map((cell, cellIndex) => {

                        const isVisible = (cellIndex >= x - viewRadius) && (cellIndex <= x + viewRadius) &&
                            (rowIndex >= y - viewRadius) && (rowIndex <= y + viewRadius);

                        const isPlayerHere = isVisible && playerList.some((player) =>
                            player.position.x === cellIndex && player.position.y === rowIndex);

                        return (
                            <div key={cellIndex} className={`minimap-cell ${cell != '#' ? 'walkable' : 'obstacle'} 
                                ${isPlayerHere ? 'player' : ''} 
                                ${!isVisible ? 'dimmed' : ''}`}/>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default MiniMap;
