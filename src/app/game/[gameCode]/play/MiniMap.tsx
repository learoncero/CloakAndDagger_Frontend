import React from "react";
import { Player, Sabotage, Task } from "@/app/types";
import SabotageIconDisplay from "@/app/game/[gameCode]/play/SabotageIconDisplay";
import TaskIconDisplay from "@/app/game/[gameCode]/play/TaskIconDisplay";
import EmergencyButtonDisplay from "./EmergencyButtonDisplay";

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

  const viewRadius = 4;
  const totalViewSize = 2 * viewRadius + 1;

  const { x, y } = currentPlayer.playerPosition;

  // Start & End Coordinate calculation
  let startX = Math.max(0, x - viewRadius);
  let startY = Math.max(0, y - viewRadius);
  let endX = Math.min(map[0].length, x + viewRadius + 1);
  let endY = Math.min(map.length, y + viewRadius + 1);

  // Set ViewRadious to a minimum Size if close to border
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

  return (
    <div className="w-[1150px] h-[565px]">
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
            const cellWidth = Math.floor(1150 / row.length); //Rundet das Ergebnis ab
            const cellHeight = Math.floor(565 / map.length);
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
                        ? "bg-red-950 opacity-30"
                        : "bg-red-950"
                    } 
                    ${isPlayerHere && isVisible ? "bg-red-600" : ""} 
                    `}
              >
                {sabotageInCell != undefined && (
                  <SabotageIconDisplay isSabotageInteractable={false} />
                )}
                {taskInCell && isVisible && (
                  <TaskIconDisplay
                    completed={taskInCell.completed}
                    isTaskInteractable={false}
                    role={currentPlayer.role}
                  />
                )}
                {cell === "E" && (
                  <EmergencyButtonDisplay isButtonInteractable={false} />
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
