import { useEffect, useState } from "react";
import { Task as TaskType } from "@/app/types";

export default function useNearbyTasks(
  tasks: TaskType[],
  currentPlayerPosition: { x: number; y: number }
) {
  const [nearbyTasks, setNearbyTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const filterNearbyTasks = () => {
      const filteredTasks = tasks.filter(
        (task) =>
          Math.abs(task.position.x - currentPlayerPosition.x) <= 1 &&
          Math.abs(task.position.y - currentPlayerPosition.y) <= 1
      );
      setNearbyTasks(filteredTasks);
    };

    const filterInterval = setInterval(filterNearbyTasks, 200);

    return () => clearInterval(filterInterval);
  }, [currentPlayerPosition, tasks]);

  return nearbyTasks;
}
