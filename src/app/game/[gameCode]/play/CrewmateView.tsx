import RoleInformation from "./RoleInformation";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import TaskList from "@/app/game/[gameCode]/play/TaskList";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import {Player, Sabotage} from "@/app/types";
import {useEffect, useState} from "react";
import useGame from "@/state/useGame";
import './MiniMap.css';



interface CrewmateViewProps {
    map: boolean[][],
    playerList: Player[],
    currentPlayer: Player
}

export default function CrewmateView({ map, playerList, currentPlayer }: CrewmateViewProps) {
    const [showMiniMap, setShowMiniMap] = useState(false);
    const { game, updateGame } = useGame();
    const handleToggleMiniMap = () => {
        setShowMiniMap(!showMiniMap);
    };
    useEffect(() => {
        const toggleMiniMap = (event: KeyboardEvent) => {
            if (event.key === 'm' || event.key === 'M') {
                setShowMiniMap(!showMiniMap);
            }
        };

        window.addEventListener('keydown', toggleMiniMap);

        return () => {
            window.removeEventListener('keydown', toggleMiniMap);
        };
    }, [showMiniMap]);

  return (
    <div className="flex justify-between items-start p-4">
      <div className="flex-none">
          <TaskList />
      </div>

      <div className="flex-grow flex justify-center">
        <RoleInformation role={"CREWMATE"} />
      </div>

      {/* Map Button on top right */}
      <div className="flex-none">
          <MapButton onClick={handleToggleMiniMap} label="Show MiniMap" />
          {showMiniMap && (
              <div className="MiniMap-overlay" onClick={() => setShowMiniMap(false)}>
                  <TaskList />
                  <div className="MiniMap-content" onClick={e => e.stopPropagation()}>
                      <MiniMap map={map} playerList={playerList} currentPlayer={currentPlayer} closeMiniMap={() => setShowMiniMap(false)}  />

                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
