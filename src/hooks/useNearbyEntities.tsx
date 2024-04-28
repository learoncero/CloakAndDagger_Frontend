import { useEffect, useState } from "react";
import { Player } from "@/app/types";

export default function useNearbyEntities(
  gamePlayers: Player[],
  currentPlayer: Player,
  roleFilter: string[]
) {
  const [nearbyEntities, setNearbyEntities] = useState<Player[]>([]);

  useEffect(() => {
    const filterNearbyEntities = () => {
      const filteredEntities = gamePlayers.filter(
        (player) =>
          Math.abs(player.position.x - currentPlayer.position.x) <= 1 &&
          Math.abs(player.position.y - currentPlayer.position.y) <= 1 &&
          player.id !== currentPlayer.id &&
          roleFilter.includes(player.role)
      );
      setNearbyEntities(filteredEntities);
    };

    const filterInterval = setInterval(filterNearbyEntities, 200);

    return () => clearInterval(filterInterval);
  }, [currentPlayer, gamePlayers, roleFilter]);

  return nearbyEntities;
}
