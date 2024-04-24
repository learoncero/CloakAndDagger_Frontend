import { Player } from "@/app/types";
import './MapDisplay.css';
import PlayerSprites from './PlayerSprites';
import {useEffect, useState} from "react";



type Props = {
  map: string[][];
  playerList: Player[];
  currentPlayer: Player;
  isTaskSabotaged: boolean;
};

export default function MapDisplay({ map, playerList, currentPlayer, isTaskSabotaged}: Props) {
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

  const viewportSize = 4 * 2 + 1;
  const halfViewport = Math.floor(viewportSize / 2);
  const { x, y } = currentPlayer.position;
  let startX = Math.max(0, x - halfViewport);
  let endX = Math.min(map[0].length, x + halfViewport + 1);
  let startY = Math.max(0, y - halfViewport);
  let endY = Math.min(map.length, y + halfViewport + 1);


  if (startX == 0) {
    endX = viewportSize;
  }
  if (startY == 0) {
    endY = viewportSize;
  }

  console.log("SpielerID:" + currentPlayer.id);


  startX = Math.max(0, startX);
  startY = Math.max(0, startY);
  return (
      <div className="MapDisplay-map-container">
        {map.slice(startY, endY).map((row, rowIndex) => (
            <div key={rowIndex} className="MapDisplay-row">
              {row.slice(startX, endX).map((cell, cellIndex) => {
                const cellPosX = cellIndex + startX;
                const cellPosY = rowIndex + startY;
                const isPlayerHere = playerList.some(player => player.position.x === cellPosX && player.position.y === cellPosY);

                return (
                    <div
                        key={cellIndex}
                        className={`MapDisplay-cell ${cell!= '#' ? 'walkable' : 'obstacle'}`}
                        style={isTaskSabotaged ? {
                            backgroundImage: `url(Sabotage_Icon.png)`,
                            backgroundSize: 'cover',
                            } : {}}
                    >
                    {isPlayerHere && playerList.filter(player => player.position.x === cellPosX && player.position.y === cellPosY)
                          .map(player => (
                              <PlayerSprites key={player.id} player={player} />
                          ))}
                    </div>
                );
              })}
            </div>
        ))}
      </div>
  );
}