import { Game, Player, Sabotage } from "@/app/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import SabotageList from "./SabotageList";
import RoleInformation from "./RoleInformation";
import KillButton from "./KillButton";

type Props = {
  sabotages: Sabotage[] | undefined;
  game: Game | null | undefined;
  killPlayer: (gameCode: string, playerId: number) => void;
};

export default function ImpostorView({ sabotages, game, killPlayer }: Props) {
  const [isPlayerNearby, setIsPlayerNearby] = useState(true);
  const [nearbyPlayers, setNearbyPlayers] = useState<Player[]>([]);
  const [isTimer, setIsTimer] = useState(false);

  const currentPlayerId = Number(sessionStorage.getItem("playerId")) as number;
  const currentPlayer = game?.players.find(
    (player) => player.id === currentPlayerId
  ) as Player;

  // Function to filter nearby players
  function filterNearbyPlayers(players: Player[]): Player[] {
    return players.filter(
      (player) =>
        Math.abs(player.position.x - currentPlayer.position.x) <= 1 &&
        Math.abs(player.position.y - currentPlayer.position.y) <= 1 &&
        player.id !== currentPlayerId // Exclude the current player
    );
  }

  function handleKill() {
    if (nearbyPlayers.length > 0) {
      // Enable kill button
      //console.log("Timer is running: ", isTimer);
      if (!isTimer) {
        // Retrieve the ID of the player to be killed (for simplicity, just choose the first nearby player)
        const playerToKillId = nearbyPlayers[0].id;
        killPlayer(game?.gameCode as string, playerToKillId);

        // Show toast notification for the kill
        toast("You killed a crewmate!", {
          position: "bottom-right",
          style: {
            border: "2px solid black", // Red border
            padding: "16px",
            color: "black", // Text color
            backgroundColor: "#eF4444", // Red background
          },
          icon: "🔪",
        });

        setIsTimer(true);
        setTimeout(() => {
          setIsTimer(false);
        }, 20000);
      }
    }
  }

  // Use useEffect to run the filtering logic periodically
  useEffect(() => {
    const filterInterval = setInterval(() => {
      // Call filterNearbyPlayers function to update nearby players list
      const updatedNearbyPlayers = filterNearbyPlayers(
        game?.players as Player[]
      );
      setNearbyPlayers(updatedNearbyPlayers);

      // Update disabled state based on the presence of nearby players
      setIsPlayerNearby(updatedNearbyPlayers.length != 0); // Disable the kill button if no nearby players
    }, 200);

    return () => clearInterval(filterInterval);
  }, [game?.players]);

  return (
    <div className="flex justify-between items-start p-4">
      <div className="flex-none">
        <SabotageList sabotages={sabotages} />
      </div>

      {/* Role Information in top center */}
      <div className="flex-grow flex justify-center">
        <RoleInformation role={"IMPOSTOR"} />
      </div>

      {/* Map Button on top right */}
      <div className="flex-none">
        <p>Map Button Component Goes Here</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <KillButton handleKill={handleKill} isPlayerNearby={isPlayerNearby} isTimer={isTimer}/>
      </div>
      <Toaster />
    </div>
  );
}
