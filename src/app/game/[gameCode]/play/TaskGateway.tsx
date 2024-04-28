import React from "react";
import TaskPasscode from "./TaskPasscode";

type TaskProps = {
    taskType: number;
    onClose: () => void;
    gameCode: string;
}

export default function TaskGateway({ taskType, onClose, gameCode }: TaskProps) {
    switch (taskType) {
        case 1:
            return <TaskPasscode onClose={onClose} gameCode={gameCode} />;
        default:
            return null;
    }
};

