import { Game, Player, Sabotage } from "@/app/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import SabotageList from "./SabotageList";
import RoleInformation from "./RoleInformation";
import KillButton from "./KillButton";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import MapDisplay from "./MapDisplay";
import PlayerList from "./PlayerList";

type Props = {
  sabotages: Sabotage[] | undefined;
  game: Game | null | undefined;
  killPlayer: (gameCode: string, playerId: number) => void;
  map: boolean[][];
  currentPlayer: Player;
  playerList: Player[];
};

export default function ImpostorView({
  sabotages,
  map,
  playerList,
  currentPlayer,
  game,
  killPlayer,
}: Props) {
  const [nearbyPlayers, setNearbyPlayers] = useState<Player[]>([]);
  const [isTimer, setIsTimer] = useState(false);

  const currentPlayerId = Number(sessionStorage.getItem("playerId")) as number;

  const [showMiniMap, setShowMiniMap] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyE") {
        console.log("Key E pressed");
        handleKill();
      } else if (event.key === "m" || event.key === "M") {
        setShowMiniMap((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKill]);

  useEffect(() => {
    const filterInterval = setInterval(() => {
      if (game?.players) {
        const updatedNearbyPlayers = filterNearbyPlayers(game.players);
        setNearbyPlayers(updatedNearbyPlayers);
      }
    }, 200);

    return () => clearInterval(filterInterval);
  }, [game?.players]);

  //todo filter for ghosts
  function filterNearbyPlayers(players: Player[]): Player[] {
    return players.filter(
      (player) =>
        Math.abs(player.position.x - currentPlayer.position.x) <= 1 &&
        Math.abs(player.position.y - currentPlayer.position.y) <= 1 &&
        player.id !== currentPlayerId &&
        player.role !== "CREWMATE_GHOST" &&
        player.role !== "IMPOSTOR_GHOST"
    );
  }

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

  const toggleMiniMap = () => setShowMiniMap((prev) => !prev);

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-5 lg:p-10">
      <div className="flex-none w-1/4">
        <RoleInformation role={"IMPOSTOR"} />
        <SabotageList sabotages={sabotages ?? []} />
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
          <MapButton onClick={toggleMiniMap} label="Show MiniMap" />
          <PlayerList playerId={currentPlayer.id} playerList={playerList} />
        </div>

        <div className="flex justify-center">
          <KillButton
            handleKill={handleKill}
            isPlayerNearby={nearbyPlayers.length > 0}
            isTimer={isTimer}
          >
            {isTimer ? "Kill on cooldown" : "Kill"}
          </KillButton>
        </div>
      </div>

      {showMiniMap && (
        <div className="MiniMap-overlay" onClick={() => setShowMiniMap(false)}>
          <SabotageList sabotages={sabotages ?? []} />
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
      <Toaster />
    </div>
  );
}
