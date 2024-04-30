import {Player, Task, Sabotage, Role} from "@/app/types";
import PlayerSprites from './PlayerSprites';
import TaskIconDisplay from './TaskIconDisplay';
import SabotageIconDisplay from "./SabotageIconDisplay";


type Props = {
  map: string[][];
  playerList: Player[];
  currentPlayer: Player;
  tasks: Task[]
  sabotages: Sabotage[];
};


export default function MapDisplay({ map, playerList, currentPlayer, tasks, sabotages }: Props) {
  //console.log("MapDisplay tasks: ", tasks);
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
  return (
      <div className="relative border-3 border-black">
        {map.slice(startY, endY).map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.slice(startX, endX).map((cell, cellIndex) => {
                const cellPosX = cellIndex + startX;
                const cellPosY = rowIndex + startY;
                const isPlayerHere = playerList.some(player => player.position.x === cellPosX && player.position.y === cellPosY);
                const taskInCell = tasks.find(task => task.position.x === cellPosX && task.position.y === cellPosY);
                const sabotageInCell = sabotages.find(sabotage => sabotage.position.x === cellPosX && sabotage.position.y === cellPosY);
                //console.log("Sabotage In Cell (MapDisplay): ", sabotageInCell);
                return (
                    <div
                        key={cellIndex}
                        className={`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border border-1 border-gray-300 box-border 
                                  ${cell!= '#' ? 'bg-gray-400' : 'bg-red-950'}`}
                    >
                    {isPlayerHere && playerList.filter(player => player.position.x === cellPosX && player.position.y === cellPosY)
                          .map(player => (
                              <PlayerSprites key={player.id} player={player} />
                              // eslint-disable-next-line react/jsx-no-comment-textnodes
                          ))}

                      {taskInCell !== undefined && (
                          <TaskIconDisplay completed={taskInCell.completed} />
                        )}
                      {sabotageInCell !== undefined && (
                          <SabotageIconDisplay/>
                      )}
                    </div>
                );
              })}
            </div>
        ))}
      </div>
  );
}
