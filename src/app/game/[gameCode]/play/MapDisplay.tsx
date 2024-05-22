import { Player, Task, Sabotage } from "@/app/types";
import TaskIconDisplay from "./TaskIconDisplay";
import SabotageIconDisplay from "./SabotageIconDisplay";
import { DeadBody, PlayerSprites } from "./PlayerSprites";

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

  const isGhost = (player: Player) =>
    player.role === "CREWMATE_GHOST" || player.role === "IMPOSTOR_GHOST";

  const visiblePlayers =
    currentPlayer.role === "IMPOSTOR_GHOST" || "CREWMATE_GHOST"
      ? playerList.filter(
          (player) => !isGhost(player) || player.id === currentPlayer.id
        )
      : playerList.filter((player) => !isGhost(player));

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
            return (
              <div
                key={cellIndex}
                className={`w-13 h-13 md:w-16 md:h-16 lg:w-19 lg:h-19 border border-1 border-gray-300 box-border ${
                  cell != "#" ? "bg-gray-400" : "bg-red-950"
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
                    isTaskInteractable={!!nearbyTask}
                    role={currentPlayer.role}
                  />
                )}
                {sabotageInCell !== undefined && <SabotageIconDisplay />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
