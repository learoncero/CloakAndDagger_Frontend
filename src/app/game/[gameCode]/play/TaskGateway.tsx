import React from "react";
import TaskPasscode from "./TaskPasscode";
import TaskColorSeq from "./TaskColorSeq";
import TaskDecipherSymbols from "@/app/game/[gameCode]/play/TaskDecipherSymbols";
import TaskSortingAlgorithm from "@/app/game/[gameCode]/play/TaskSortingAlgorithm";

type TaskProps = {
  miniGameId: number;
  taskId: number;
  gameCode: string;
  handleTaskCompleted: (taskId: number) => void;
};

export default function TaskGateway({
  miniGameId,
  taskId,
  gameCode,
  handleTaskCompleted,
}: TaskProps) {
  switch (miniGameId) {
    case 1:
      return (
          <div>
            <TaskPasscode
              taskId={taskId}
              gameCode={gameCode}
              handleTaskCompleted={(taskId: number) => handleTaskCompleted(taskId)}
            />
          </div>
      );
    case 2:
      return (
          <TaskColorSeq
              taskId={taskId}
              gameCode={gameCode}
              handleTaskCompleted={(taskId: number) => handleTaskCompleted(taskId)}
          />
      );
    case 3:
        return (
            <TaskDecipherSymbols
                taskId={taskId}
                gameCode={gameCode}
                handleTaskCompleted={(taskId: number) => handleTaskCompleted(taskId)}
            />
        );
    case 4:
        return (
            <TaskSortingAlgorithm
                taskId={taskId}
                gameCode={gameCode}
                handleTaskCompleted={(taskId: number) => handleTaskCompleted(taskId)}
            />
        );
    default:
      return null;
  }
}
