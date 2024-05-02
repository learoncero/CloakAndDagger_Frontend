import React, { useCallback, useEffect, useState } from "react";
import RoleInformation from "./RoleInformation";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import TaskList from "@/app/game/[gameCode]/play/TaskList";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import { Game, Player, Role, Task as TaskType } from "@/app/types";
import ActionButton from "@/components/ActionButton";
import MapDisplay from "./MapDisplay";
import PlayerList from "./PlayerList";
import TaskGateway from "@/app/game/[gameCode]/play/TaskGateway";
import useNearbyEntities from "@/hooks/useNearbyEntities";
import useNearbyTasks from "@/hooks/useNearbyTasks";
import MiniGameService from "@/services/MiniGameService";
import toast, {Toaster} from "react-hot-toast";

type Props = {
  map: string[][];
  currentPlayer: Player;
  game: Game;
  reportBody: (gameCode: string, playerId: number) => void;
  showTaskPopup: boolean;
  handleShowTaskPopup: (show: boolean) => void;
};

export default function CrewmateView({
  map,
  currentPlayer,
  game,
  reportBody,
  showTaskPopup,
  handleShowTaskPopup,
}: Props) {
  const [showMiniMap, setShowMiniMap] = useState(false);

  const handleToggleMiniMap = () => {
    setShowMiniMap(!showMiniMap);
  };

  const nearbyGhosts = useNearbyEntities(game.players, currentPlayer, [
    Role.CREWMATE_GHOST,
    Role.IMPOSTOR_GHOST,
  ]);

  const nearbyTasks = useNearbyTasks(game.tasks, currentPlayer.position);

  const handleToggleTaskPopup = useCallback(async () => {
    if (nearbyTasks.length > 0) {
      const setActiveStatusAndLog = async () => {
        const active = await MiniGameService.setActiveStatus(
            nearbyTasks[0].taskId,
            game.gameCode
        );
        console.log("Active status: ", active);
      };

      if (showTaskPopup) {
        handleShowTaskPopup(false);
        console.log("Show task popup: ", false);
        await setActiveStatusAndLog();
      } else {
        handleShowTaskPopup(true);
        console.log("Show task popup: ", true);
        await setActiveStatusAndLog();
      }
    }
  }, [game.gameCode, handleShowTaskPopup, nearbyTasks, showTaskPopup]);


  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.key === "e" || event.key === "E") {
        if (nearbyTasks.length === 0) return;

        const status = await MiniGameService.getActiveStatus(
            nearbyTasks[0].taskId,
            game.gameCode
        );

        if (status.data === true && !showTaskPopup) {
          toast("Task already occupied", {
            position: "bottom-right",
            style: {
              border: "2px solid black",
              padding: "16px",
              color: "white",
              backgroundColor: "#eF4444",
            },
            icon: "✖️",
          });
          return;
        }

        const response = await MiniGameService.startTask(
          nearbyTasks[0].taskId,
          nearbyTasks[0].miniGameId,
          game.gameCode
        );
        if (response.status === 200) {
          await handleToggleTaskPopup();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [game.gameCode, handleToggleTaskPopup, nearbyTasks]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "m" || event.key === "M") {
        setShowMiniMap((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [setShowMiniMap]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "KeyR") {
        handleReportBody();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleReportBody]);

  function handleReportBody() {
    if (nearbyGhosts.length > 0) {
      const bodyToReportId = nearbyGhosts[0].id;
      if (!game.reportedBodies.includes(bodyToReportId)) {
        reportBody(game.gameCode, bodyToReportId);
      }
    }
  }

  function handleTaskCompleted(taskId: number) {
    let task = game.tasks.find((task) => task.taskId === taskId);
    if (task) {
      task.completed = true;
    }
    handleShowTaskPopup(false);
  }

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-5 lg:p-10">
      <div className="flex-none w-1/4">
        <RoleInformation role={"CREWMATE"} />
        <TaskList tasks={game.tasks} />
      </div>
      <div className="flex-grow flex justify-center">
        {map ? (
          <MapDisplay
            map={map}
            playerList={game.players}
            currentPlayer={currentPlayer}
            tasks={game.tasks}
            sabotages={game.sabotages ?? []}
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
      <Toaster />
      {showMiniMap && (
        <div className="fixed flex justify-center items-center bg-black bg-opacity-75 z-1000 overflow-auto" onClick={() => setShowMiniMap(false)}>
          <TaskList tasks={game.tasks}/>
          <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-md justify-center flex-warp" onClick={(e) => e.stopPropagation()}>
            <MiniMap
              map={map}
              playerList={game.players}
              currentPlayer={currentPlayer}
              closeMiniMap={() => setShowMiniMap(false)}
              tasks={game.tasks}
              sabotages={game.sabotages}
            />
          </div>
        </div>
      )}
      {showTaskPopup && (
        <TaskGateway
          miniGameId={nearbyTasks[0].miniGameId}
          taskId={nearbyTasks[0].taskId}
          gameCode={game.gameCode}
          handleTaskCompleted={() => handleTaskCompleted(nearbyTasks[0].taskId)}
        />
      )}
    </div>
  );
}
