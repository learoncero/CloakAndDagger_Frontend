import React, { useState } from "react";
import TaskCompletedPopup from "@/app/game/[gameCode]/play/TaskCompletedPopup";

type RockPaperScissorProps = {
    onConfirm: (choice: string) => void;
    onCancel: () => void;
};

const RockPaperScissor: React.FC<RockPaperScissorProps> = ({
                                                               onConfirm,
                                                               onCancel,
                                                           }) => {
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

    const handleChoiceClick = (choice: string) => {
        setSelectedChoice(choice);
        onConfirm(choice);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="flex flex-col items-center bg-black rounded-lg p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4">Choose Rock, Paper, or Scissors</h2>
                <div className="flex gap-4 mt-4">
                    <button
                        className={`w-24 h-24 border-2 ${selectedChoice === "Rock" ? "border-blue-500" : "border-white"}`}
                        onClick={() => handleChoiceClick("Rock")}
                    >
                        Rock
                    </button>
                    <button
                        className={`w-24 h-24 border-2 ${selectedChoice === "Paper" ? "border-blue-500" : "border-white"}`}
                        onClick={() => handleChoiceClick("Paper")}
                    >
                        Paper
                    </button>
                    <button
                        className={`w-24 h-24 border-2 ${selectedChoice === "Scissors" ? "border-blue-500" : "border-white"}`}
                        onClick={() => handleChoiceClick("Scissors")}
                    >
                        Scissors
                    </button>
                </div>
                <div className="flex w-full justify-between mt-4 gap-2">
                    <button
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-lg"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RockPaperScissor;
