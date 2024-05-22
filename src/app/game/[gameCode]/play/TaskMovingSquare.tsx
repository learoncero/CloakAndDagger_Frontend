import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from "react-hot-toast";
import TaskCompletedPopup from "@/app/game/[gameCode]/play/TaskCompletedPopup";

type TaskMovingSquareProps = {
    taskId: number;
    gameCode: string;
    handleTaskCompleted: (taskId: number) => void;
};

const SQUARE_POSITIONS = [
    { top: 0, left: 50 },
    { top: 0, left: 100 },
    { top: 50, left: 100 },
    { top: 100, left: 100 },
    { top: 100, left: 50 },
    { top: 100, left: 0 },
    { top: 50, left: 0 },
    { top: 0, left: 0 },
];

export default function TaskMovingSquare({
                                             taskId,
                                             gameCode,
                                             handleTaskCompleted,
                                         }: TaskMovingSquareProps) {
    const [currentRound, setCurrentRound] = useState(1);
    const [redSquareIndex, setRedSquareIndex] = useState(0);
    const [isTaskCompleted, setIsTaskCompleted] = useState(false);
    const yellowSquareIndex = useRef(Math.floor(Math.random() * 8));
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const speed = 500 / currentRound;

    useEffect(() => {
        startMovingSquare();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentRound]);

    const startMovingSquare = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setRedSquareIndex((prevIndex) => (prevIndex + 1) % 8);
        }, speed);
    };

    const handleButtonClick = () => {
        if (redSquareIndex === yellowSquareIndex.current) {
            if (currentRound < 3) {
                setCurrentRound((prevRound) => prevRound + 1);
                toast.success("Great! Proceed to the next round.", {
                    position: "bottom-center",
                });
            } else {
                setIsTaskCompleted(true);
            }
        } else {
            setCurrentRound(1);
            toast.error("Missed! Back to round one.", {
                position: "bottom-center",
            });
        }
    };

    const onClose = () => {
        handleTaskCompleted(taskId);
    };


    return (
        <>
            {isTaskCompleted ? (
                <TaskCompletedPopup onClose={onClose} />
            ) : (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
                    <div className="bg-black rounded-lg p-8 max-w-md relative">
                        <h2 className="text-2xl font-bold mb-4 text-center">Catch the Red Square</h2>
                        <div className="grid grid-cols-3 gap-2" style={{ width: "150px", height: "150px", position: "relative" }}>
                            {SQUARE_POSITIONS.map((pos, index) => (
                                <div
                                    key={index}
                                    className={`absolute w-10 h-10 ${index === yellowSquareIndex.current ? 'bg-yellow-500' : ''} ${index === redSquareIndex ? 'bg-red-500' : 'bg-gray-500'}`}
                                    style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
                                />
                            ))}
                            <button
                                onClick={handleButtonClick}
                                className="w-10 h-10 bg-blue-500 rounded hover:bg-blue-700"
                                style={{ position: 'absolute', top: '47%', left: '47%', transform: 'translate(-50%, -50%)' }}
                            />
                        </div>
                    </div>
                    <Toaster />
                </div>
            )}
        </>
    );
}
