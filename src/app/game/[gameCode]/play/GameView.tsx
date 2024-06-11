import { useCallback, useEffect, useState } from "react";
import { Game, Player, Role, Task, Sabotage } from "@/app/types";
import toast, { Toaster } from "react-hot-toast";
import TaskList from "./TaskList";
import MapDisplay from "./MapDisplay";
import PlayerList from "./PlayerList";
import CrewmateCounter from "./CrewmateCounter";
import MiniMap from "./MiniMap";
import TaskGateway from "./TaskGateway";
import ActionButton from "@/components/ActionButton";
import useNearbyItems from "@/hooks/useNearbyItems";
import useNearbyPlayers from "@/hooks/useNearbyPlayers";
import useNearbyWall from "@/hooks/useNearbyWall";
import TaskService from "@/services/TaskService";
import Manual from "./Manual";
import ToggleButton from "@/components/ToggleButton";
import InformationPopUp from "./InformationPopUp";
import useNearbyDeadBodies from "@/hooks/useNearbyDeadBodies";
import SabotageList from "./SabotageList";
import RoleInformation from "./RoleInformation";
import RockPaperScissor from "./RockPaperScissor";

type Props = {
  game: Game;
  map: string[][];
  currentPlayer: Player;
  getSabotagePosition: (sabotageId: number) => void;
  handleCancelSabotage: () => void;
  killPlayer: (
    gameCode: string,
    playerId: number,
    nearbyTaskForKill: number
  ) => void;
  reportBody: (gameCode: string, playerId: number) => void;
  handleTaskCompleted: (taskId: number) => void;
  showTaskPopup: boolean;
  handleShowTaskPopup: (show: boolean) => void;
  showBodyReported: boolean;
  handleShowBodyReported: (show: boolean) => void;
  handleVentUsage: (gameCode: string, id: number) => void;
  showChat: boolean;
  stompClient: any;
  showEmergencyMeeting: boolean;
  callEmergencyMeeting: (gameCode: string) => void;
  handleEmergencyMeeting: (show: boolean) => void;
  isEmergencyMeetingTimeout: boolean;
};

export default function GameView({
  game,
  map,
  currentPlayer,
  getSabotagePosition,
  handleCancelSabotage,
  killPlayer,
  reportBody,
  handleTaskCompleted,
  showTaskPopup,
  handleShowTaskPopup,
  showBodyReported,
  handleShowBodyReported,
  handleVentUsage,
  showChat,
  showEmergencyMeeting,
  callEmergencyMeeting,
  handleEmergencyMeeting,
  isEmergencyMeetingTimeout,
  stompClient,
}: Props) {
  const isImpostor =
    currentPlayer?.role == Role.IMPOSTOR ||
    currentPlayer?.role == Role.IMPOSTOR_GHOST;
  const isGhost =
    currentPlayer?.role == Role.CREWMATE_GHOST ||
    currentPlayer?.role == Role.IMPOSTOR_GHOST;
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [isTimer, setIsTimer] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showRockPaperScissor, setShowRockPaperScissor] = useState(false);

  const isSabotageActive = (
    sabotageId: number,
    position: { x: number; y: number }
  ) => {
    return game.sabotages.some(
      (sabotage) =>
        sabotage.id === sabotageId &&
        (sabotage.position.x !== position.x ||
          sabotage.position.y !== position.y)
    );
  };

  const handleToggleMiniMap = () => {
    if (!isSabotageActive(3, { x: -1, y: -1 })) {
      setShowMiniMap(!showMiniMap);
    } else if (isSabotageActive(3, { x: -1, y: -1 }) && !isImpostor) {
      toast("Minimap is disabled due to sabotage!", {
        position: "bottom-right",
        style: {
          border: "2px solid black",
          padding: "16px",
          color: "white",
          backgroundColor: "#eF4444",
        },
        icon: "⚠️",
      });
    } else {
      setShowMiniMap(!showMiniMap);
    }
  };

  const toggleManualVisibility = useCallback(() => {
    setShowManual(!showManual);
  }, [showManual]);

  const nearbyTasks = useNearbyItems(
    game.tasks,
    currentPlayer.playerPosition
  ) as Task[];

  const nearbyTasksForKill = useNearbyItems(
    game.tasks,
    currentPlayer.playerPosition
  ) as Task[];

  const nearbySabotages = useNearbyItems(
    game.sabotages,
    currentPlayer.playerPosition
  ) as Sabotage[];

  const nearbyPlayers = useNearbyPlayers(
    game?.players || [],
    currentPlayer as Player,
    [Role.CREWMATE, Role.IMPOSTOR]
  );

  const nearbyDeadBodies = useNearbyDeadBodies(
    game?.players || [],
    currentPlayer as Player
  );

  const nearbyWalls = useNearbyWall(
    game.sabotages,
    currentPlayer.playerPosition
  );

  const handleToggleTaskPopup = useCallback(async () => {
    if (nearbyTasks.length > 0) {
      const setActiveStatus = async () => {
        await TaskService.setActiveStatus(nearbyTasks[0].taskId, game.gameCode);
      };

      if (showTaskPopup) {
        handleShowTaskPopup(false);
        await setActiveStatus();
        await TaskService.cancelTask(
          nearbyTasks[0].taskId,
          nearbyTasks[0].miniGameId,
          game.gameCode
        );
      } else {
        handleShowTaskPopup(true);
        await setActiveStatus();
      }
    }
  }, [game.gameCode, handleShowTaskPopup, nearbyTasks, showTaskPopup]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isImpostor && event.code === "KeyE") {
        handleKill();
      }
      if (
        isSabotageActive(3, { x: -1, y: -1 }) &&
        (event.key === "m" ||
          event.key === "M" ||
          event.key === "q" ||
          event.key === "Q") &&
        !isImpostor
      ) {
        setShowMiniMap(false);
        toast("Minimap is disabled due to sabotage!", {
          position: "bottom-right",
          style: {
            border: "2px solid black",
            padding: "16px",
            color: "white",
            backgroundColor: "#eF4444",
          },
          icon: "⚠️",
        });
      } else if (
        (event.key === "m" ||
          event.key === "M" ||
          event.key === "q" ||
          event.key === "Q") &&
        !showChat
      ) {
        setShowMiniMap((prev) => !prev);
      }
      if (event.code === "KeyR") {
        handleReportBody();
      } else if (
        (event.key === "F" || event.key === "f") &&
        !showChat &&
        !showMiniMap &&
        !showEmergencyMeeting &&
        !isEmergencyMeetingTimeout &&
        !isGhost
      ) {
        callEmergencyMeeting(game.gameCode);
      } else if (event.code === "KeyG" && nearbyWalls.length > 0) {
        setShowRockPaperScissor(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKill, setShowMiniMap, nearbyWalls]);

  const handleChoice = () => {
    setShowRockPaperScissor(false);
  };

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (
        (event.key === "e" || event.key === "E") &&
        !showChat &&
        !showMiniMap &&
        !showEmergencyMeeting
      ) {
        if (
          nearbyTasks.length === 0 ||
          (currentPlayer?.role !== Role.CREWMATE &&
            currentPlayer?.role !== Role.CREWMATE_GHOST) ||
          nearbyTasks[0]?.completed
        ) {
          return;
        }

        const status = await TaskService.getActiveStatus(
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
        } else if (status.data === false && !showTaskPopup) {
          const response = await TaskService.startTask(
            nearbyTasks[0].taskId,
            nearbyTasks[0].miniGameId,
            game.gameCode
          );
          if (response.status === 200) {
            await handleToggleTaskPopup();
          }
        } else if (status.data === true && showTaskPopup) {
          await handleToggleTaskPopup();
        }
      }
      if (event.code === "KeyV" && isImpostor && !showMiniMap && !showMiniMap) {
        handleVentUsage(game.gameCode, currentPlayer.id);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [game.gameCode, handleToggleTaskPopup, nearbyTasks]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "KeyC" && nearbySabotages.length > 0 && !showMiniMap) {
        handleCancelSabotage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [nearbySabotages]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.key === "h" || event.key === "H") && !showChat) {
        toggleManualVisibility();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showChat, toggleManualVisibility]);

  async function handleKill() {
    if (!isTimer && nearbyPlayers.length > 0) {
      const playerToKillId = nearbyPlayers[0].id;
      killPlayer(
        game?.gameCode as string,
        playerToKillId,
        nearbyTasksForKill[0]?.taskId
      );

      toast("You killed a crewmate!", {
        position: "bottom-right",
        style: {
          border: "2px solid black",
          padding: "16px",
          color: "black",
          backgroundColor: "#eF4444",
        },
        icon: "🔪",
      });

      setIsTimer(true);
      setTimeout(() => {
        setIsTimer(false);
      }, 20000);
    }
  }

  function handleReportBody() {
    if (nearbyDeadBodies.length > 0) {
      const bodyToReportId = nearbyDeadBodies[0].id;
      if (!game.reportedBodies.includes(bodyToReportId)) {
        reportBody(game.gameCode, bodyToReportId);
      }
    }
  }

  return (
    <div>
      {showManual && (
        <Manual role={currentPlayer.role} onClose={toggleManualVisibility} />
      )}
      {showBodyReported && (
        <InformationPopUp
          imageSrc={"/bodyReported.png"}
          heading={"Body Reported!"}
          text={"Oh no! Looks like someone is taking a long nap!"}
          onDismiss={() => handleShowBodyReported(false)}
        />
      )}
      {showEmergencyMeeting && (
        <InformationPopUp
          imageSrc={"/emergencyMeeting.png"}
          heading={"Emergency Meeting!"}
          text={
            "Attention crew! An emergency meeting has been initiated. Share your suspicions and vote to find the impostor!"
          }
          onDismiss={() => handleEmergencyMeeting(false)}
        />
      )}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-5 lg:p-10">
        <div className="flex-none w-1/4">
          <RoleInformation role={currentPlayer.role} />
          {isImpostor ? (
            <SabotageList
              sabotages={game.sabotages}
              getSabotagePosition={getSabotagePosition}
              showMiniMap={showMiniMap}
            />
          ) : (
            <TaskList tasks={game.tasks} />
          )}
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
              isEmergencyMeetingTimeout={isEmergencyMeetingTimeout}
            />
          ) : (
            <div>Loading map...</div>
          )}
        </div>

        <div className="flex-none w-1/4">
          <div className="mb-7">
            <div className="flex gap-10">
              <ToggleButton
                onClick={handleToggleMiniMap}
                label="Show Minimap"
              />
              <ToggleButton
                onClick={toggleManualVisibility}
                label="Show Manual"
              />
            </div>
            <PlayerList playerId={currentPlayer.id} playerList={game.players} />
            {isImpostor && <CrewmateCounter playerList={game.players} />}
          </div>

          <div className="flex gap-5 justify-center">
            {isImpostor && (
              <ActionButton
                onClick={handleKill}
                buttonclickable={
                  nearbyPlayers.length > 0 &&
                  !isTimer &&
                  currentPlayer.role === Role.IMPOSTOR
                }
                colorActive="bg-red-600"
              >
                {isTimer ? "⏳ Kill on cooldown" : "🔪 Kill"}
              </ActionButton>
            )}
            <ActionButton
              onClick={() => handleReportBody()}
              buttonclickable={
                nearbyDeadBodies.length > 0 &&
                !game.reportedBodies.includes(nearbyDeadBodies[0].id)
              }
              colorActive="bg-cyan-600"
            >
              📢 Report Body
            </ActionButton>
          </div>
        </div>
        <Toaster />
        {showMiniMap && (
          <div
            className="fixed flex justify-center items-center bg-black bg-opacity-75 z-1000 overflow-auto pr-14"
            onClick={() => setShowMiniMap(false)}
          >
            {isImpostor ? (
              <SabotageList
                sabotages={game.sabotages}
                getSabotagePosition={getSabotagePosition}
                showMiniMap={showMiniMap}
              />
            ) : (
              <TaskList tasks={game.tasks} />
            )}
            <div
              className="ml-8 flex items-center p-2 bg-white rounded-lg shadow-md justify-center flex-warp"
              onClick={(e) => e.stopPropagation()}
            >
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

        {isImpostor ? (
          <Toaster />
        ) : showTaskPopup ? (
          <TaskGateway
            miniGameId={nearbyTasks[0].miniGameId}
            taskId={nearbyTasks[0].taskId}
            gameCode={game.gameCode}
            handleTaskCompleted={() =>
              handleTaskCompleted(nearbyTasks[0].taskId)
            }
          />
        ) : (
          ""
        )}
        {showRockPaperScissor && (
          <RockPaperScissor
            stompClient={stompClient}
            gameCode={game.gameCode}
            onConfirm={handleChoice}
            onCancel={() => setShowRockPaperScissor(false)}
          />
        )}
      </div>
    </div>
  );
}
