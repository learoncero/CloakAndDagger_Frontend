import React from "react";
import TaskPasscode from "./TaskPasscode";

type TaskProps = {
    taskType: number;
    taskId: number;
    onClose: () => void;
    gameCode: string;
}

export default function TaskGateway({ taskType, onClose, gameCode, taskId }: TaskProps) {
    switch (taskType) {
        case 1:
            return <TaskPasscode onClose={onClose} gameCode={gameCode} taskId={taskId} />;
        default:
            return null;
    }
};

