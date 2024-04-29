import React from "react";
import TaskPasscode from "./TaskPasscode";

type TaskProps = {
  taskId: number;
  gameCode: string;
  handleTaskCompleted: (taskId: number) => void;
};

export default function TaskGateway({
  taskId,
  gameCode,
  handleTaskCompleted,
}: TaskProps) {
  switch (taskId) {
    case 1:
      return (
        <TaskPasscode
          // TODO id should be taskId
          taskId={1}
          gameCode={gameCode}
          handleTaskCompleted={(taskId: number) => handleTaskCompleted(taskId)}
        />
      );
    default:
      return null;
  }
}
