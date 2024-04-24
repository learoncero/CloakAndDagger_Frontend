import { Player } from "@/app/types";
import "./MapDisplay.css";
import PlayerSprites from "./PlayerSprites";
import { useEffect, useState } from "react";

type Props = {
  map: string[][];
  playerList: Player[];
  currentPlayer: Player;
};

export default function MapDisplay({ map, playerList, currentPlayer }: Props) {
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

  startX = Math.max(0, startX);
  startY = Math.max(0, startY);
  return (
    <div className="MapDisplay-map-container">
      {map.slice(startY, endY).map((row, rowIndex) => (
        <div key={rowIndex} className="MapDisplay-row">
          {row.slice(startX, endX).map((cell, cellIndex) => {
            const cellPosX = cellIndex + startX;
            const cellPosY = rowIndex + startY;
            const isPlayerHere = playerList.some(
              (player) =>
                player.position.x === cellPosX && player.position.y === cellPosY
            );

            return (
              <div
                key={cellIndex}
                className={`MapDisplay-cell ${
                  cell != "#" ? "walkable" : "obstacle"
                }`}
              >
                {isPlayerHere &&
                  playerList
                    .filter(
                      (player) =>
                        player.position.x === cellPosX &&
                        player.position.y === cellPosY
                    )
                    .map((player) => (
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
