import RoleInformation from "./RoleInformation";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import TaskList from "@/app/game/[gameCode]/play/TaskList";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import { Game, Player } from "@/app/types";
import { useEffect, useState } from "react";
import "./MiniMap.css";
import ActionButton from "@/components/ActionButton";
import MapDisplay from "./MapDisplay";
import PlayerList from "./PlayerList";
interface CrewmateViewProps {
  map: boolean[][];
  playerList: Player[];
  currentPlayer: Player;
  game: Game;
}
export default function CrewmateView({
  map,
  playerList,
  currentPlayer,
  game,
}: CrewmateViewProps) {
  const [showMiniMap, setShowMiniMap] = useState(false);
  const handleToggleMiniMap = () => {
    setShowMiniMap(!showMiniMap);
  };
  const [nearbyGhosts, setNearbyGhosts] = useState<Player[]>([]);

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
        // TODO: implement reportBody function
      } else if (event.key === "m" || event.key === "M") {
        setShowMiniMap((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const filterInterval = setInterval(() => {
      if (game?.players) {
        const updatedNearbyGhosts = filterNearbyGhosts(game.players);
        setNearbyGhosts(updatedNearbyGhosts);
      }
    }, 200);

    return () => clearInterval(filterInterval);
  }, [game.players]);

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
            onClick={() => {}} // TODO: implement reportBody function
            buttonclickable={nearbyGhosts.length > 0}
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
