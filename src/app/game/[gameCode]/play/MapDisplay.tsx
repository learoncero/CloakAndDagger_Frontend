import React, { useEffect, useState } from "react";
import { Player, Task, Sabotage } from "@/app/types";
import EmergencyButtonDisplay from "./EmergencyButtonDisplay";
import TaskIconDisplay from "./TaskIconDisplay";
import SabotageIconDisplay from "./SabotageIconDisplay";
import { DeadBody, PlayerSprites } from "./PlayerSprites";
import VentIconDisplay from "./VentIconDisplay";
import Wall from "./Wall";

type Props = {
  map: string[][];
  playerList: Player[];
  currentPlayer: Player;
  tasks: Task[];
  sabotages: Sabotage[];
  nearbyTask?: Task;
  isEmergencyMeetingTimeout: boolean;
  mapName: String;
};

export default function MapDisplay({
  map,
  playerList,
  currentPlayer,
  tasks,
  sabotages,
  nearbyTask,
  isEmergencyMeetingTimeout,
  mapName,
}: Props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMapVisible, setIsMapVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMapVisible(window.innerWidth > 1025);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isMapVisible) {
    return (
      <div className="map-overlay">
        Map is hidden due to small window size. Please switch to full screen to
        view the map.
      </div>
    );
  }

  const isSabotageActive = (
    sabotageId: number,
    position: { x: number; y: number }
  ) => {
    return sabotages.some(
      (sabotage) =>
        sabotage.id === sabotageId &&
        (sabotage.position.x !== position.x ||
          sabotage.position.y !== position.y)
    );
  };

  const isCrewmate =
    currentPlayer.role === "CREWMATE" ||
    currentPlayer.role === "CREWMATE_GHOST";
  const viewportSize =
    isSabotageActive(1, { x: -1, y: -1 }) && isCrewmate ? 5 : 4 * 2 + 1;
  const halfViewport = Math.floor(viewportSize / 2);
  const { x, y } = currentPlayer.playerPosition;
  let startX = Math.max(0, x - halfViewport);
  let endX = Math.min(map[0].length, x + halfViewport + 1);
  let startY = Math.max(0, y - halfViewport);
  let endY = Math.min(map.length, y + halfViewport + 1);

  if (startX === 0) {
    endX = Math.min(viewportSize, map[0].length);
  }
  if (startY === 0) {
    endY = Math.min(viewportSize, map.length);
  }

  if (endX >= map[0].length) {
    startX = Math.max(0, map[0].length - viewportSize);
  }
  if (endY >= map.length) {
    startY = Math.max(0, map.length - viewportSize);
  }

  startX = Math.max(0, startX);
  startY = Math.max(0, startY);

  const isAdjacent = (
    posX: number,
    posY: number,
    targetX: number,
    targetY: number
  ) => {
    return (
      (posX === targetX && Math.abs(posY - targetY) === 1) ||
      (posY === targetY && Math.abs(posX - targetX) === 1) ||
      (Math.abs(posX - targetX) === 1 && Math.abs(posY - targetY) === 1)
    );
  };

  const isGhost = (player: Player) =>
    player.role === "CREWMATE_GHOST" || player.role === "IMPOSTOR_GHOST";

  const visiblePlayers =
    currentPlayer.role === "IMPOSTOR_GHOST" ||
    currentPlayer.role === "CREWMATE_GHOST"
      ? playerList
      : playerList.filter((player) => !isGhost(player));

  const activeWallSabotage = sabotages.find((sabotage) => sabotage.id === 4);

  return (
    <div className="relative border-3 border-black">
      {map.slice(startY, endY).map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.slice(startX, endX).map((cell, cellIndex) => {
            const cellPosX = cellIndex + startX;
            const cellPosY = rowIndex + startY;
            const isPlayerHere = visiblePlayers.some(
              (player) =>
                player.playerPosition.x === cellPosX &&
                player.playerPosition.y === cellPosY
            );
            const deadBodyHere = playerList.some(
              (player) =>
                player.deadBodyPosition.x === cellPosX &&
                player.deadBodyPosition.y === cellPosY
            );
            const taskInCell = tasks.find(
              (task) =>
                task.position.x === cellPosX && task.position.y === cellPosY
            );
            const sabotageInCell = sabotages.find(
              (sabotage) =>
                sabotage.position.x === cellPosX &&
                sabotage.position.y === cellPosY
            );

            const cellNumValue = parseInt(cell);
            const ventInCell =
              cellNumValue.valueOf() >= 0 && cellNumValue.valueOf() <= 9;

            const isButtonInteractable = isAdjacent(
              currentPlayer.playerPosition.x,
              currentPlayer.playerPosition.y,
              cellPosX,
              cellPosY
            );

            const isSabotageInteractable = isAdjacent(
              currentPlayer.playerPosition.x,
              currentPlayer.playerPosition.y,
              cellPosX,
              cellPosY
            );

            const isWallInteractable = isAdjacent(
              currentPlayer.playerPosition.x,
              currentPlayer.playerPosition.y,
              cellPosX,
              cellPosY
            );

            const isTaskInteractable =
              !!nearbyTask &&
              (currentPlayer.role === "CREWMATE" ||
                currentPlayer.role === "CREWMATE_GHOST");

            const isVentInteractable = isAdjacent(
              currentPlayer.playerPosition.x,
              currentPlayer.playerPosition.y,
              cellPosX,
              cellPosY
            );
            return (
              <div
                key={cellIndex}
                className={`w-13 h-13 md:w-16 md:h-16 lg:w-19 lg:h-19 box-border relative ${
                  cell === "#"
                    ? mapName === "Spaceship"
                      ? "bg-spaceshipWall border-2 border-gray-600"
                      : "bg-jungleWall border-2 border-green-400"
                    : mapName === "Spaceship"
                    ? "bg-spaceshipFloor border-2 border-gray-400"
                    : "bg-jungleFloor border-2 border-orange-100"
                }`}
              >
                {isPlayerHere &&
                  playerList
                    .filter(
                      (player) =>
                        player.playerPosition.x === cellPosX &&
                        player.playerPosition.y === cellPosY
                    )
                    .map((player) => (
                      <PlayerSprites
                        key={player.id}
                        player={player}
                        currentPlayerRole={currentPlayer.role}
                      />
                    ))}
                {deadBodyHere &&
                  playerList
                    .filter(
                      (player) =>
                        player.deadBodyPosition.x === cellPosX &&
                        player.deadBodyPosition.y === cellPosY
                    )
                    .map((player) => (
                      <DeadBody
                        key={player.id}
                        playerColor={player.playerColor}
                      />
                    ))}

                {taskInCell !== undefined && (
                  <TaskIconDisplay
                    completed={taskInCell.completed}
                    isTaskInteractable={isTaskInteractable}
                    role={currentPlayer.role}
                  />
                )}
                {sabotageInCell !== undefined && (
                  <SabotageIconDisplay
                    isSabotageInteractable={isSabotageInteractable}
                    isVisible={true}
                  />
                )}
                {cell === "E" && (
                  <EmergencyButtonDisplay
                    isButtonInteractable={isButtonInteractable}
                    isVisible={true}
                    isEmergencyMeetingTimeout={isEmergencyMeetingTimeout}
                  />
                )}

                {ventInCell && (
                  <VentIconDisplay
                    isVentInteractable={isVentInteractable}
                    role={currentPlayer.role}
                    isVisible={true}
                  />
                )}
                {activeWallSabotage &&
                  activeWallSabotage.wallPositions &&
                  activeWallSabotage.wallPositions
                    .flat()
                    .some(
                      (pos: { x: number; y: number }) =>
                        pos.x === cellPosX && pos.y === cellPosY
                    ) && <Wall isWallInteractable={isWallInteractable} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
