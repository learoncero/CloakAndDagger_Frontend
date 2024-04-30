import React from "react";
import TaskPasscode from "./TaskPasscode";

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
        <TaskPasscode
          // TODO id should be taskId
          taskId={taskId}
          gameCode={gameCode}
          handleTaskCompleted={(taskId: number) => handleTaskCompleted(taskId)}
        />
      );
    default:
      return null;
  }
}
