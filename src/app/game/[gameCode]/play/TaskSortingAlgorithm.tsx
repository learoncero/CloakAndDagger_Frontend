import React, { useState, useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast";
import TaskCompletedPopup from "@/app/game/[gameCode]/play/TaskCompletedPopup";
import MiniGameSortingAlgorithmService from "@/services/MiniGameSortingAlgorithmService";

type TaskSortingAlgorithmProps = {
    taskId: number;
    gameCode: string;
    handleTaskCompleted: (taskId: number) => void;
};

export default function TaskSortingAlgorithm({
                                                 taskId,
                                                 gameCode,
                                                 handleTaskCompleted,
                                             }: TaskSortingAlgorithmProps) {
    const [boxes, setBoxes] = useState<number[]>([]);
    const [isShowTaskCompletedPopUp, setIsShowTaskCompletedPopUp] = useState<boolean>(false);
    const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchShuffledBoxes = async () => {
            try {
                const response = await MiniGameSortingAlgorithmService.getShuffledBoxes(gameCode, taskId);
                if (response.data) {
                    setBoxes(response.data);
                } else {
                    toast.error("Failed to fetch shuffled boxes!", {
                        position: "bottom-right",
                        style: {
                            border: "2px solid black",
                            padding: "16px",
                            color: "white",
                            backgroundColor: "#eF4444",
                        },
                        icon: "✖️",
                    });
                }
            } catch (error) {
                toast.error("An error occurred while fetching shuffled boxes!", {
                    position: "bottom-right",
                    style: {
                        border: "2px solid black",
                        padding: "16px",
                        color: "white",
                        backgroundColor: "#eF4444",
                    },
                    icon: "✖️",
                });
            }
        };

        fetchShuffledBoxes();
    }, [gameCode, taskId]);

    const handleBoxClick = (index: number) => {
        if (selectedBoxIndex === null) {
            setSelectedBoxIndex(index);
        } else if (selectedBoxIndex === index) {
            setSelectedBoxIndex(null);
        } else if (Math.abs(selectedBoxIndex - index) === 1) {
            const newBoxes = [...boxes];
            [newBoxes[selectedBoxIndex], newBoxes[index]] = [newBoxes[index], newBoxes[selectedBoxIndex]];
            setBoxes(newBoxes);
            setSelectedBoxIndex(index);

            if (newBoxes.every((val, i, arr) => !i || arr[i - 1] <= val)) {
                const submitSorting = async () => {
                    try {
                        const response = await MiniGameSortingAlgorithmService.submitSortingAlgorithm(gameCode, taskId, newBoxes);
                        if (response.data) {
                            setIsShowTaskCompletedPopUp(true);
                        } else {
                            toast.error("Sorting verification failed!", {
                                position: "bottom-right",
                                style: {
                                    border: "2px solid black",
                                    padding: "16px",
                                    color: "white",
                                    backgroundColor: "#eF4444",
                                },
                                icon: "✖️",
                            });
                        }
                    } catch (error) {
                        toast.error("An error occurred while submitting the sorted boxes!", {
                            position: "bottom-right",
                            style: {
                                border: "2px solid black",
                                padding: "16px",
                                color: "white",
                                backgroundColor: "#eF4444",
                            },
                            icon: "✖️",
                        });
                    }
                };

                submitSorting();
            }
        } else {
            toast.error("You can only swap adjacent boxes!", {
                position: "top-center",
                style: {
                    border: "2px solid black",
                    padding: "16px",
                    color: "white",
                    backgroundColor: "#eF4444",
                },
                icon: "✖️",
            });
        }
    };

    const onClose = () => {
        setIsShowTaskCompletedPopUp(false);
        handleTaskCompleted(taskId);
    };

    const renderBoxes = () => {
        return (
            <div className="flex space-x-2 mb-4">
                {boxes.map((size, index) => (
                    <div
                        key={index}
                        onClick={() => handleBoxClick(index)}
                        className={`cursor-pointer flex items-center justify-center rounded bg-gray-500 hover:bg-gray-600 ${
                            selectedBoxIndex === index ? "border-2 border-green-500" : ""
                        }`}
                        style={{
                            width: `${size * 30}px`,
                            height: `${size * 30}px`,
                        }}
                    >
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            {isShowTaskCompletedPopUp ? (
                <TaskCompletedPopup onClose={onClose} />
            ) : (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
                    <div className="bg-black rounded-lg p-8 max-w-xl">
                        <h2 className="text-2xl font-bold mb-4">Sorting Algorithm</h2>
                        <p className="text-lg mb-4">Arrange the boxes from smallest to biggest.</p>
                        {renderBoxes()}
                    </div>
                    <Toaster />
                </div>
            )}
        </>
    );
}
