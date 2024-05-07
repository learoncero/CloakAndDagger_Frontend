/*
import { Game, Player, Role, Sabotage, Task as TaskType } from "@/app/types";

import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import SabotageList from "./SabotageList";
import RoleInformation from "./RoleInformation";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import ActionButton from "@/components/ActionButton";
import PlayerList from "./PlayerList";
import CrewmateCounter from "./CrewmateCounter";
import MapDisplay from "./MapDisplay";
import useNearbyEntities from "@/hooks/useNearbyEntities";
import useNearbyItems from "@/hooks/useNearbyItems";

type Props = {
  map: string[][];
  currentPlayer: Player;
  game: Game;
  killPlayer: (gameCode: string, playerId: number) => void;
  reportBody: (gameCode: string, playerId: number) => void;
  getSabotagePosition: (sabotageId: number) => void;
  handleCancelSabotage: () => void;
};

export default function ImpostorView({
  map,
  currentPlayer,
  game,
  killPlayer,
  reportBody,
  getSabotagePosition,
  handleCancelSabotage,
}: Props) {
  const [isTimer, setIsTimer] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const nearbyPlayers = useNearbyEntities(game?.players || [], currentPlayer, [
    Role.CREWMATE,
    Role.IMPOSTOR,
  ]);
  const nearbyGhosts = useNearbyEntities(game?.players || [], currentPlayer, [
    Role.CREWMATE_GHOST,
    Role.IMPOSTOR_GHOST,
  ]);
  const nearbyTasks = useNearbyItems(
    game.tasks,
    currentPlayer.position
  ) as TaskType[];
  const nearbySabotages = useNearbyItems(
    game.sabotages,
    currentPlayer.position
  ) as Sabotage[];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyE") {
        handleKill();
      } else if (event.key === "m" || event.key === "M") {
        setShowMiniMap((prev) => !prev);
      } else if (event.code === "KeyR") {
        handleReportBody();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKill, setShowMiniMap]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "KeyC" && nearbySabotages.length > 0) {
        handleCancelSabotage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [nearbySabotages]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleKill() {
    if (!isTimer && nearbyPlayers.length > 0) {
      const playerToKillId = nearbyPlayers[0].id;
      killPlayer(game?.gameCode as string, playerToKillId);

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
    const currentNearbyGhosts = nearbyGhosts;
    if (currentNearbyGhosts.length > 0) {
      const bodyToReportId = currentNearbyGhosts[0].id;
      if (!game.reportedBodies.includes(bodyToReportId)) {
        reportBody(game.gameCode, bodyToReportId);
      }
    }
  }

  const toggleMiniMap = () => setShowMiniMap((prev) => !prev);

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-5 lg:p-10">
      <div className="flex-none w-1/4">
        <RoleInformation role={"IMPOSTOR"} />
        <SabotageList
          sabotages={game.sabotages ?? []}
          getSabotagePosition={getSabotagePosition}
        />
      </div>

      <div className="flex-grow flex justify-center">
        {map ? (
          <MapDisplay
            map={map}
            playerList={game.players}
            currentPlayer={currentPlayer}
            tasks={game.tasks}
            sabotages={game.sabotages ?? []}
          />
        ) : (
          <div>Loading map...</div>
        )}
      </div>

      <div className="flex-none w-1/4">
        <div className="mb-20">
          <MapButton onClick={toggleMiniMap} label="Show MiniMap" />
          <PlayerList playerId={currentPlayer.id} playerList={game.players} />
          <CrewmateCounter playerList={game.players} />
        </div>

        <div className="flex justify-center gap-5">
          <ActionButton
            onClick={handleKill}
            buttonclickable={nearbyPlayers.length > 0 && !isTimer}
            colorActive="bg-red-600"
          >
            {isTimer ? "⏳ Kill on cooldown" : "🔪 Kill"}
          </ActionButton>
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
        <div
          className="fixed flex justify-center items-center bg-black bg-opacity-75 z-1000 overflow-auto"
          onClick={() => setShowMiniMap(false)}
        >
          <SabotageList
            sabotages={game.sabotages ?? []}
            getSabotagePosition={getSabotagePosition}
          />
          <div
            className={
              "flex flex-col items-center p-2 bg-white rounded-lg shadow-md justify-center flex-warp"
            }
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
      <Toaster />
    </div>
  );
}
*/
