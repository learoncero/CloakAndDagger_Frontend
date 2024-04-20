import RoleInformation from "./RoleInformation";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import TaskList from "@/app/game/[gameCode]/play/TaskList";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import { Player, Sabotage } from "@/app/types";
import { useEffect, useState } from "react";
import useGame from "@/state/useGame";
import "./MiniMap.css";
import MapDisplay from "./MapDisplay";
import PlayerList from "./PlayerList";
interface CrewmateViewProps {
  map: boolean[][];
  playerList: Player[];
  currentPlayer: Player;
}
export default function CrewmateView({
  map,
  playerList,
  currentPlayer,
}: CrewmateViewProps) {
  const [showMiniMap, setShowMiniMap] = useState(false);
  const handleToggleMiniMap = () => {
    setShowMiniMap(!showMiniMap);
  };
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
  return (
    <div className="flex justify-between items-start p-10">
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
        <MapButton onClick={handleToggleMiniMap} label="Show MiniMap" />
        <PlayerList playerId={currentPlayer.id} playerList={playerList} />
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
