import RoleInformation from "./RoleInformation";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import TaskList from "@/app/game/[gameCode]/play/TaskList";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import { Player } from "@/app/types";
import { useEffect, useState } from "react";
import "./MiniMap.css";
import MapDisplay from "./MapDisplay";
import PlayerList from "./PlayerList";

type Props = {
  map: string[][];
  playerList: Player[];
  currentPlayer: Player;
};

export default function CrewmateView({
  map,
  playerList,
  currentPlayer,
}: Props) {
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
