import {useCallback, useEffect, useState} from "react";
import RoleInformation from "./RoleInformation";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import TaskList from "@/app/game/[gameCode]/play/TaskList";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import { Game, Player, Role, Task as TaskType } from "@/app/types";
import "./MiniMap.css";
import ActionButton from "@/components/ActionButton";
import MapDisplay from "./MapDisplay";
import PlayerList from "./PlayerList";
import TaskGateway from "@/app/game/[gameCode]/play/TaskGateway";
import TaskIconDisplay from "@/app/game/[gameCode]/play/TaskIconDisplay";
import useNearbyEntities from "@/hooks/useNearbyEntities";
import useNearbyTasks from "@/hooks/useNearbyTasks";

type Props = {
  map: string[][];
  currentPlayer: Player;
  game: Game;
  reportBody: (gameCode: string, playerId: number) => void;
};

export default function CrewmateView({
  map,
  currentPlayer,
  game,
  reportBody,
  }: Props) {

  const [showMiniMap, setShowMiniMap] = useState(false);
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [taskMiniGameId, setTaskMiniGameId] = useState<number>(0);

  const handleToggleMiniMap = () => {
    setShowMiniMap(!showMiniMap);
  };

  const nearbyGhosts = useNearbyEntities(game.players, currentPlayer, [
    Role.CREWMATE_GHOST,
    Role.IMPOSTOR_GHOST,
  ]);

  const nearbyTasks = useNearbyTasks(game.tasks, currentPlayer.position);

  const handleToggleTaskPopup = useCallback(() => {
    if (nearbyTasks.length > 0) {
      const miniGameId = nearbyTasks[0].miniGameId;
      setTaskMiniGameId(miniGameId);
      setShowTaskPopup((prevShowTaskPopup) => !prevShowTaskPopup);
    }
  }, [nearbyTasks]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "e" || event.key === "E") {
        handleToggleTaskPopup();
      }
    };


    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleToggleTaskPopup, nearbyTasks]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyR") {
        handleReportBody();
      } else if (event.key === "m" || event.key === "M") {
        setShowMiniMap((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleReportBody, setShowMiniMap]);

  function handleReportBody() {
    if (nearbyGhosts.length > 0) {
      const bodyToReportId = nearbyGhosts[0].id;
      if (!game.reportedBodies.includes(bodyToReportId)) {
        reportBody(game.gameCode, bodyToReportId);
      }
    }
  }

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-5 lg:p-10">
      <div className="flex-none w-1/4">
        <RoleInformation role={"CREWMATE"} />
        <TaskList tasks={game.tasks}/>
      </div>
      <div className="flex-grow flex justify-center">
        {map ? (
          <MapDisplay
            map={map}
            playerList={game.players}
            currentPlayer={currentPlayer}
            tasks={game.tasks}
            nearbyTask={nearbyTasks[0]}
          />
        ) : (
          <div>Loading map...</div>
        )}
      </div>

      <div className="flex-none w-1/4">
        <div className="mb-32">
          <MapButton onClick={handleToggleMiniMap} label="Show MiniMap" />
          <PlayerList playerId={currentPlayer.id} playerList={game.players} />
        </div>

        <div className="flex justify-center">
          <ActionButton
            onClick={() => handleReportBody()}
            buttonclickable={
              nearbyGhosts.length > 0 &&
              !game.reportedBodies.includes(nearbyGhosts[0].id)
            }
            colorActive="bg-cyan-600"
          >
            📢 Report Body
          </ActionButton>
        </div>
      </div>

      {showMiniMap && (
        <div className="MiniMap-overlay" onClick={() => setShowMiniMap(false)}>
          <TaskList tasks={game.tasks}/>
          <div className="MiniMap-content" onClick={(e) => e.stopPropagation()}>
            <MiniMap
              map={map}
              playerList={game.players}
              currentPlayer={currentPlayer}
              closeMiniMap={() => setShowMiniMap(false)}
              //todo tasks={game.tasks}
            />
          </div>
        </div>
      )}
      {showTaskPopup && (
          <TaskGateway
              taskType={taskMiniGameId}
              onClose={() => setShowTaskPopup(false)}
              gameCode={game.gameCode}
          />
      )}
    </div>
  );
}
