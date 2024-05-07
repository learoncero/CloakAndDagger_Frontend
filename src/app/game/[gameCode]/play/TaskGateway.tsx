import React from "react";
import TaskPasscode from "./TaskPasscode";
import TaskColorSeq from "./TaskColorSeq";

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
      )
    default:
      return null;
  }
}
