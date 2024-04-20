import React from "react";

interface TaskPopupProps {
    onClose: () => void;
}

const TaskPopup: React.FC<TaskPopupProps> = ({ onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
            <div className="bg-black rounded-lg p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4">Task Title</h2>
                <p className="text-lg mb-4">Description of the task...</p>
                {/* Add your task-specific content here */}
                <button className="bg-gray-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default TaskPopup;
