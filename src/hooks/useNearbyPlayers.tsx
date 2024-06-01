import { useEffect, useState } from "react";
import { Player } from "@/app/types";

export default function useNearbyPlayers(
  gamePlayers: Player[],
  currentPlayer: Player,
  roleFilter: string[]
) {
  const [nearbyPlayers, setNearbyPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const filterNearbyEntities = () => {
      const filteredEntities = gamePlayers.filter(
        (player) =>
          Math.abs(player.playerPosition.x - currentPlayer.playerPosition.x) <=
            1 &&
          Math.abs(player.playerPosition.y - currentPlayer.playerPosition.y) <=
            1 &&
          player.id !== currentPlayer.id &&
          roleFilter.includes(player.role)
      );
      setNearbyPlayers(filteredEntities);
    };
    filterNearbyEntities();

    const filterInterval = setInterval(filterNearbyEntities, 200);

    return () => clearInterval(filterInterval);
  }, [currentPlayer, gamePlayers, roleFilter]);

  return nearbyPlayers;
}
