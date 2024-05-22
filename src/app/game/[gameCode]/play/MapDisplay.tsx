import { Player, Task, Sabotage } from "@/app/types";
import PlayerSprites from "./PlayerSprites";
import TaskIconDisplay from "./TaskIconDisplay";
import SabotageIconDisplay from "./SabotageIconDisplay";
import EmergencyButtonDisplay from "./EmergencyButtonDisplay";

type Props = {
  map: string[][];
  playerList: Player[];
  currentPlayer: Player;
  tasks: Task[];
  sabotages: Sabotage[];
  nearbyTask?: Task;
};
export default function MapDisplay({
  map,
  playerList,
  currentPlayer,
  tasks,
  sabotages,
  nearbyTask,
}: Props) {
  const viewportSize = 4 * 2 + 1;
  const halfViewport = Math.floor(viewportSize / 2);
  const { x, y } = currentPlayer.position;
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

  return (
    <div className="relative border-3 border-black">
      {map.slice(startY, endY).map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.slice(startX, endX).map((cell, cellIndex) => {
            const cellPosX = cellIndex + startX;
            const cellPosY = rowIndex + startY;
            const isPlayerHere = playerList.some(
              (player) =>
                player.position.x === cellPosX && player.position.y === cellPosY
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
            const isButtonInteractable = isAdjacent(
              currentPlayer.position.x,
              currentPlayer.position.y,
              cellPosX,
              cellPosY
            );

            const isSabotageInteractable = isAdjacent(
              currentPlayer.position.x,
              currentPlayer.position.y,
              cellPosX,
              cellPosY
            );
            return (
              <div
                key={cellIndex}
                className={`w-13 h-13 md:w-16 md:h-16 lg:w-19 lg:h-19 border border-1 border-gray-300 box-border 
                                  ${
                                    cell != "#" ? "bg-gray-400" : "bg-red-950"
                                  } relative`}
              >
                {isPlayerHere &&
                  playerList
                    .filter(
                      (player) =>
                        player.position.x === cellPosX &&
                        player.position.y === cellPosY
                    )
                    .map((player) => (
                      <PlayerSprites
                        key={player.id}
                        player={player}
                        currentPlayerRole={currentPlayer.role}
                      />
                      // eslint-disable-next-line react/jsx-no-comment-textnodes
                    ))}

                {taskInCell !== undefined && (
                  <TaskIconDisplay
                    completed={taskInCell.completed}
                    isTaskInteractable={!!nearbyTask}
                    role={currentPlayer.role}
                  />
                )}
                {sabotageInCell !== undefined && (
                  <SabotageIconDisplay
                    isSabotageInteractable={isSabotageInteractable}
                  />
                )}
                {cell === "E" && (
                  <EmergencyButtonDisplay
                    isButtonInteractable={isButtonInteractable}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
