import { useEffect, useRef, useState } from "react";
import RoleInformation from "./RoleInformation";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import TaskList from "@/app/game/[gameCode]/play/TaskList";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import { Game, Player } from "@/app/types";
import "./MiniMap.css";
import ActionButton from "@/components/ActionButton";
import MapDisplay from "./MapDisplay";
import PlayerList from "./PlayerList";

type Props = {
  map: string[][];
  playerList: Player[];
  currentPlayer: Player;
  game: Game;
  reportBody: (gameCode: string, playerId: number) => void;
};

export default function CrewmateView({
  map,
  playerList,
  currentPlayer,
  game,
  reportBody,
}: Props) {
  const [showMiniMap, setShowMiniMap] = useState(false);
  const handleToggleMiniMap = () => {
    setShowMiniMap(!showMiniMap);
  };
  const [nearbyGhosts, setNearbyGhosts] = useState<Player[]>([]);

  // Ref to store the latest value of nearbyGhosts
  const nearbyGhostsRef = useRef<Player[]>([]);
  nearbyGhostsRef.current = nearbyGhosts;

  useEffect(() => {
    const filterInterval = setInterval(() => {
      if (game?.players) {
        const updatedNearbyGhosts = filterNearbyGhosts(game.players);
        setNearbyGhosts(updatedNearbyGhosts);
      }
    }, 200);

    return () => clearInterval(filterInterval);
  }, [game.players]);

  useEffect(() => {
    const toggleMiniMap = (event: KeyboardEvent) => {
      if (event.key === "m" || event.key === "M") {
        setShowMiniMap(!showMiniMap);
      }
    };

    window.addEventListener("keydown", toggleMiniMap);

    return () => {
      window.removeEventListener("keydown", toggleMiniMap);
    };
  }, [showMiniMap]);

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
  }, [currentPlayer]);

  function filterNearbyGhosts(players: Player[]): Player[] {
    return players.filter(
      (player) =>
        Math.abs(player.position.x - currentPlayer.position.x) <= 1 &&
        Math.abs(player.position.y - currentPlayer.position.y) <= 1 &&
        player.id !== currentPlayer.id &&
        player.role !== "CREWMATE" &&
        player.role !== "IMPOSTOR"
    );
  }

  function handleReportBody() {
    console.log("reported bodies: ", game.reportedBodies);
    const currentNearbyGhosts = nearbyGhostsRef.current;
    if (currentNearbyGhosts.length > 0) {
      const bodyToReportId = currentNearbyGhosts[0].id;
      if (!game.reportedBodies.includes(bodyToReportId)) {
        reportBody(game.gameCode, bodyToReportId);
      }
    }
  }

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-5 lg:p-10">
      <div className="flex-none w-1/4">
        <RoleInformation role={"CREWMATE"} />
        <TaskList />
      </div>

      <div className="flex-grow flex justify-center">
        {map ? (
          <MapDisplay
            map={map}
            playerList={playerList}
            currentPlayer={currentPlayer}
          />
        ) : (
          <div>Loading map...</div>
        )}
      </div>

      <div className="flex-none w-1/4">
        <div className="mb-32">
          <MapButton onClick={handleToggleMiniMap} label="Show MiniMap" />
          <PlayerList playerId={currentPlayer.id} playerList={playerList} />
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
          <TaskList />
          <div className="MiniMap-content" onClick={(e) => e.stopPropagation()}>
            <MiniMap
              map={map}
              playerList={playerList}
              currentPlayer={currentPlayer}
              closeMiniMap={() => setShowMiniMap(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
