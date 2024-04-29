import React, { useEffect, useState } from "react";
import TaskService from "@/services/TaskService";
import toast, { Toaster } from "react-hot-toast";
import TaskCompletedPopup from "./TaskCompletedPopup";
import {Task} from "@/app/types";

type TaskPasscodeProps = {
    taskId: number;
    onClose: () => void;
    gameCode: string;
}

export default function TaskPasscode({ onClose, gameCode, taskId }: TaskPasscodeProps) {
    const [currentSum, setCurrentSum] = useState<number>(0);
    const [randomSum, setRandomSum] = useState<number>(0);
    const [taskDone, setTaskDone] = useState<boolean>(false);

    useEffect(() => {
        async function fetchRandomSum() {
            try {
                const response = await TaskService.getRandomSum(gameCode);
                setRandomSum(response.data as number);
                setCurrentSum(0);
                setTaskDone(false);
            } catch (error) {
                console.error("Error fetching random sum:", error);
            }
        }
        fetchRandomSum();
    }, [gameCode]);

    const handleButtonClick = async (value: number) => {
        if (taskDone) {
            return;
        }
        try {
            const response = await TaskService.sumUp(value, taskId, gameCode);
            const newCurrentSum = response.data as number;

            if (newCurrentSum > randomSum) {
                setCurrentSum(0);
                toast("Passcode value exceeded", {
                    position: "bottom-right",
                    style: {
                        border: "2px solid black",
                        padding: "16px",
                        color: "white",
                        backgroundColor: "#eF4444",
                    },
                    icon: "✖️",
                });
            } else {
                setCurrentSum(newCurrentSum);
                if (newCurrentSum === randomSum) {
                    setTaskDone(true);
                }
            }
        } catch (error) {
            console.error("Error sending value:", error);
        }
    };

    const handleReset = async () => {
        if (taskDone) {
            return;
        }
        try {
            await TaskService.resetSum(gameCode);
            setCurrentSum(0);
            setTaskDone(false);
        } catch (error) {
            console.error("Error resetting sum:", error);
        }
    };

    return (
        <>
            {taskDone ? (
                <TaskCompletedPopup onClose={onClose} />
            ) : (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
                    <div className="bg-black rounded-lg p-8 max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Passcode</h2>
                        <div className="mb-4">
                            <p className="text-lg">Sum to be achieved: {randomSum}</p>
                        </div>
                        <div className="grid grid-cols-5 gap-4 mb-4">
                            {[...Array(10)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => handleButtonClick(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <div className="mb-4">
                            <p className="text-lg">Current sum: {currentSum}</p>
                        </div>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                    <Toaster />
                </div>
            )}
        </>
    );
};
