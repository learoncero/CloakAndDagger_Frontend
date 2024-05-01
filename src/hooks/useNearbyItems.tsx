import { useEffect, useState } from "react";
import { Task as TaskType, Sabotage as SabotageType } from "@/app/types";

type Position = { x: number; y: number };
type NearbyItem = TaskType | SabotageType;

export default function useNearbyItems(
  items: NearbyItem[],
  currentPlayerPosition: Position
) {
  const [nearbyItems, setNearbyItems] = useState<NearbyItem[]>([]);

  useEffect(() => {
    const filterNearbyItems = () => {
      const filteredItems = items.filter(
        (item) =>
          Math.abs(item.position.x - currentPlayerPosition.x) <= 1 &&
          Math.abs(item.position.y - currentPlayerPosition.y) <= 1
      );
      setNearbyItems(filteredItems);
    };

    const filterInterval = setInterval(filterNearbyItems, 200);

    return () => clearInterval(filterInterval);
  }, [currentPlayerPosition, items]);

  return nearbyItems;
}
