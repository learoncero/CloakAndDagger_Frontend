import React from "react";
import TaskPasscode from "./TaskPasscode";

interface TaskProps {
    taskType: string;
    onClose: () => void;
}

export default function Task({ taskType, onClose }: TaskProps) {
    // Render specific task components based on task type
    switch (taskType) {
        case "passcode":
            return <TaskPasscode onClose={onClose} />;
        default:
            return null;
    }
};

