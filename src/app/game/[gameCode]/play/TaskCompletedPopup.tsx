import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

interface TaskCompletedPopupProps {
    onClose: () => void;
}

const TaskCompletedPopup: React.FC<TaskCompletedPopupProps> = ({ onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 1500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
            <div className="bg-black rounded-lg p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4">Task Done</h2>
                <p>Task completed successfully!</p>
                <Toaster />
            </div>
        </div>
    );
};

export default TaskCompletedPopup;
