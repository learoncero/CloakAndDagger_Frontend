import { useEffect, useState } from "react";
import { Player } from "@/app/types";

export default function useNearbyDeadBodies(
  gamePlayers: Player[],
  currentPlayer: Player
) {
  const [nearbyDeadBodies, setNearbyDeadBodies] = useState<Player[]>([]);

  useEffect(() => {
    const filterNearbyDeadBodies = () => {
      const filteredDeadBodies = gamePlayers.filter((player) => {
        const isDeadBodyNearby =
          Math.abs(
            player.deadBodyPosition.x - currentPlayer.playerPosition.x
          ) <= 1 &&
          Math.abs(
            player.deadBodyPosition.y - currentPlayer.playerPosition.y
          ) <= 1;
        const hasValidDeadBodyPosition =
          player.deadBodyPosition.x !== -1 && player.deadBodyPosition.y !== -1;

        return (
          isDeadBodyNearby &&
          hasValidDeadBodyPosition &&
          player.id !== currentPlayer.id
        );
      });
      setNearbyDeadBodies(filteredDeadBodies);
    };

    const filterInterval = setInterval(filterNearbyDeadBodies, 200);

    return () => clearInterval(filterInterval);
  }, [currentPlayer, gamePlayers]);

  return nearbyDeadBodies;
}
