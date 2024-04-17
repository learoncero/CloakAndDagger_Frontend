import { Player } from "@/app/types";
import React, { useState, useEffect } from 'react';
import './MapDisplay.css';

const spriteImages = [
  '/Sprites/Red2.png',
  '/Sprites/Red3.png',
  '/Sprites/Red4.png',
  '/Sprites/Red5.png'
];

type Props = {
  map: boolean[][];
  playerList: Player[];
  currentPlayer: Player;
};

export default function MapDisplay({ map, playerList, currentPlayer }: Props) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMirrored, setIsMirrored] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % spriteImages.length);
    }, 250); // Refresh every 250ms
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'a') {
        setIsMirrored(true);
      } else if (event.key === 'd') {
        setIsMirrored(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!map) {
    return <div>Loading Map...</div>;
  }

  const viewportSize = 11;
  const halfViewport = Math.floor(viewportSize / 2);
  const { x, y } = currentPlayer.position;
  const startX = Math.max(0, x - halfViewport);
  const endX = Math.min(map[0].length, x + halfViewport + 1);
  const startY = Math.max(0, y - halfViewport);
  const endY = Math.min(map.length, y + halfViewport + 1);

  return (
      <div className="MapDisplay-map-container">
        {map.slice(startY, endY).map((row, rowIndex) => (
            <div key={rowIndex} className="MapDisplay-row">
              {row.slice(startX, endX).map((cell, cellIndex) => {
                const cellPosX = cellIndex + startX;
                const cellPosY = rowIndex + startY;
                const isPlayerHere = playerList.some(player =>
                    player.position.x === cellPosX && player.position.y === cellPosY);
                return (
                    <div
                        key={cellIndex}
                        className={`MapDisplay-cell ${cell ? 'walkable' : 'obstacle'}`}
                        style={isPlayerHere ? {
                          backgroundImage: `url(${spriteImages[currentFrame]})`,
                          backgroundSize: 'cover',
                          transform: isMirrored ? 'scaleX(-1)' : 'none'
                        } : {}}
                    />
                );
              })}
            </div>
        ))}
      </div>
  );
}