import React from "react";
import TaskPasscode from "./TaskPasscode";

type TaskProps = {
    taskType: string;
    onClose: () => void;
    gameCode: string;
}

export default function Task({ taskType, onClose, gameCode }: TaskProps) {
    switch (taskType) {
        case "passcode":
            return <TaskPasscode onClose={onClose} gameCode={gameCode} />;
        default:
            return null;
    }
};

