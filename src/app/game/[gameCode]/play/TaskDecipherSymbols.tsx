import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import TaskCompletedPopup from "./TaskCompletedPopup";

type TaskDecipherSymbolsProps = {
    taskId: number;
    gameCode: string;
    handleTaskCompleted: (taskId: number) => void;
};

const symbols = ["⥊", "⥋", "⥌", "⥍", "⥎", "⥏", "⥐", "⥑", "⥒", "⥓", "⥔", "⥕", "⥖", "⥗", "⥘", "⥙", "⥚", "⥛", "⥜", "⥝", "⥞", "⥟", "⥠", "⥡", "⥦"];

export default function TaskDecipherSymbols({
                                                taskId,
                                                gameCode,
                                                handleTaskCompleted,
                                            }: TaskDecipherSymbolsProps) {
    const [correctSymbol, setCorrectSymbol] = useState<string>("");
    const [isShowTaskCompletedPopUp, setIsShowTaskCompletedPopUp] = useState<boolean>(false);
    const [currentRound, setCurrentRound] = useState<number>(1);

    const startRound = useCallback(() => {
        const roundSize = currentRound + 2;
        const randomIndex = Math.floor(Math.random() * roundSize * roundSize);
        setCorrectSymbol(symbols[randomIndex]);
    }, [currentRound]);

    useEffect(() => {
        startRound();
    }, [startRound]);

    const handleSymbolClick = (symbol: string) => {
        if (symbol === correctSymbol) {
            if (currentRound < 3) {
                setCurrentRound(currentRound + 1);
            } else {
                setIsShowTaskCompletedPopUp(true);
            }
        } else {
            toast.error("Incorrect symbol chosen!", {
                position: "bottom-right",
                style: {
                    border: "2px solid black",
                    padding: "16px",
                    color: "white",
                    backgroundColor: "#eF4444",
                },
                icon: "❌",
            });
        }
    };

    const onClose = () => {
        setIsShowTaskCompletedPopUp(false);
        setCurrentRound(1);
        handleTaskCompleted(taskId);
    };

    const renderSymbolButtons = () => {
        const roundSize = currentRound + 2;
        const symbolsPool = symbols.slice(0, roundSize * roundSize);
        return (
            <div className={`grid grid-cols-${roundSize} gap-4 mb-4`}>
                {symbolsPool.map((symbol, index) => (
                    <button
                        key={index}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded"
                        onClick={() => handleSymbolClick(symbol)}
                        style={{ fontSize: "1.3rem" }}
                    >
                        {symbol}
                    </button>
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
                    <div className="bg-black rounded-lg p-8 max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Round {currentRound}</h2>
                        <div className="mb-4">
                            <p className="text-lg">Find: {correctSymbol}</p>
                        </div>
                        {renderSymbolButtons()}
                    </div>
                    <Toaster />
                </div>
            )}
        </>
    );
}
