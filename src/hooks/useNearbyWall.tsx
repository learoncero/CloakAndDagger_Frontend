import { useEffect, useState } from "react";
import { Sabotage } from "@/app/types";

type Position = { x: number; y: number };

export default function useNearbyWall(
    sabotages: Sabotage[],
    currentPlayerPosition: Position,
    range: number = 1
) {
  const [nearbyWalls, setNearbyWalls] = useState<Position[]>([]);

  useEffect(() => {
    const filterNearbyWalls = () => {
      const walls = sabotages
          .filter((sabotage) => sabotage.id === 4 && sabotage.wallPositions)
          .flatMap((sabotage) => sabotage.wallPositions)
          .flat();

      const filteredWalls = walls.filter(
          (wallPosition) =>
              Math.abs(wallPosition.x - currentPlayerPosition.x) <= range &&
              Math.abs(wallPosition.y - currentPlayerPosition.y) <= range
      );

      setNearbyWalls(filteredWalls);
    };

    filterNearbyWalls();

    const filterInterval = setInterval(filterNearbyWalls, 200);

    return () => clearInterval(filterInterval);
  }, [currentPlayerPosition, sabotages, range]);

  return nearbyWalls;
}
