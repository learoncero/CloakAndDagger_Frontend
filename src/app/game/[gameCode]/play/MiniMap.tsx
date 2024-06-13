import React from "react";
import { Player, Sabotage, Task } from "@/app/types";
import SabotageIconDisplay from "@/app/game/[gameCode]/play/SabotageIconDisplay";
import TaskIconDisplay from "@/app/game/[gameCode]/play/TaskIconDisplay";
import EmergencyButtonDisplay from "./EmergencyButtonDisplay";
import VentIconDisplay from "@/app/game/[gameCode]/play/VentIconDisplay";

type Props = {
  map: string[][];
  playerList: Player[];
  closeMiniMap: () => any;
  currentPlayer: Player;
  tasks: Task[];
  sabotages: Sabotage[];
};

const MiniMap: React.FC<Props> = ({
  map,
  playerList,
  currentPlayer,
  tasks,
  sabotages,
}: Props) => {
  if (!map) {
    return <div>Can not show Minimap right now</div>;
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

  const isCrewmate = currentPlayer.role === "CREWMATE";
  const viewRadius =
    isSabotageActive(1, { x: -1, y: -1 }) && isCrewmate ? 2 : 4; // Set viewRadius to 2 for 5x5 viewport
  const totalViewSize = 2 * viewRadius + 1;

  const { x, y } = currentPlayer.playerPosition;

  // Start & End Coordinate calculation
  let startX = Math.max(0, x - viewRadius);
  let startY = Math.max(0, y - viewRadius);
  let endX = Math.min(map[0].length, x + viewRadius + 1);
  let endY = Math.min(map.length, y + viewRadius + 1);

  // Set ViewRadius to a minimum Size if close to border
  if (x < viewRadius) {
    startX = 0;
    endX = totalViewSize;
  }
  if (y < viewRadius) {
    startY = 0;
    endY = totalViewSize;
  }
  if (x > map[0].length - viewRadius - 1) {
    startX = map[0].length - totalViewSize;
    endX = map[0].length;
  }
  if (y > map.length - viewRadius - 1) {
    startY = map.length - totalViewSize;
    endY = map.length;
  }

  const width = window.innerWidth * 0.7;
  const height = window.innerHeight * 0.8;

  return (
    <div>
      {map.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, cellIndex) => {
            const isVisible =
              cellIndex >= startX &&
              cellIndex < endX &&
              rowIndex >= startY &&
              rowIndex < endY;
            const isPlayerHere = playerList.some(
              (player) =>
                player.playerPosition.x === cellIndex &&
                player.playerPosition.y === rowIndex
            );
            const cellWidth = Math.floor(width / row.length); //Rundet das Ergebnis ab
            const cellHeight = Math.floor(height / map.length);
            const taskInCell = tasks.find(
              (task) =>
                task.position.x === cellIndex && task.position.y === rowIndex
            );
            const sabotageInCell = sabotages.find(
              (sabotage) =>
                sabotage.position &&
                sabotage.position.x === cellIndex &&
                sabotage.position.y === rowIndex
            );
            const cellNumValue = parseInt(cell);
            const ventInCell =
              cellNumValue.valueOf() >= 0 && cellNumValue.valueOf() <= 9;
            return (
              <div
                key={cellIndex}
                style={{ width: `${cellWidth}px`, height: `${cellHeight}px` }}
                className={`border border-white box-border 
                    ${
                      cell != "#"
                        ? !isVisible
                          ? "bg-gray-200"
                          : "bg-gray-400"
                        : !isVisible
                        ? "bg-gray-800 opacity-30"
                        : "bg-gray-800"
                    } 
                    ${isPlayerHere && isVisible ? "bg-red-600" : ""} 
                    `}
              >
                {sabotageInCell != undefined && (
                  <SabotageIconDisplay
                    isSabotageInteractable={false}
                    isVisible={isVisible}
                  />
                )}
                {taskInCell && isVisible && (
                  <TaskIconDisplay
                    completed={taskInCell.completed}
                    isTaskInteractable={false}
                    role={currentPlayer.role}
                  />
                )}
                {ventInCell && (
                  <VentIconDisplay
                    isVentInteractable={false}
                    isVisible={isVisible}
                  />
                )}
                {cell === "E" && (
                  <EmergencyButtonDisplay
                    isButtonInteractable={false}
                    isVisible={isVisible}
                    isEmergencyMeetingTimeout={false}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MiniMap;
