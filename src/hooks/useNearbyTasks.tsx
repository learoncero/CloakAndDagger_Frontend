import { useEffect, useState } from "react";
import { Task } from "@/app/types";

type Props ={
  tasks: Task[];
  currentPlayerPosition: { x: number; y: number };
}

export default function useNearbyTasks({tasks, currentPlayerPosition }: Props) {
  const [nearbyTasks, setNearbyTasks] = useState<Task[]>([]);

  useEffect(() => {
    const filterNearbyTasks = () => {
      const filteredTasks = tasks.filter(
        (task) =>
          Math.abs(task.position.x - currentPlayerPosition.x) <= 1 &&
          Math.abs(task.position.y - currentPlayerPosition.y) <= 1 &&
          !task.completed
      );
      setNearbyTasks(filteredTasks);
    };

    const filterInterval = setInterval(filterNearbyTasks, 200);

    return () => clearInterval(filterInterval);
  }, [currentPlayerPosition, tasks]);

  return nearbyTasks;
}
