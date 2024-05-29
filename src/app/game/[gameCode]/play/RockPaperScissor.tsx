import React, { useState } from "react";
import RockPaperScissorService from "@/services/RockPaperScissorService";

type Props = {
    onConfirm: (choice: string) => void;
    onCancel: () => void;
    gameCode: string;
    playerId: number;
};

const RockPaperScissor: React.FC<Props> = ({ gameCode, onConfirm, onCancel }) => {
    const [playerChoice, setPlayerChoice] = useState<string | null>(null);
    const choices = ["Rock", "Paper", "Scissors"];

    const handleChoice = (choice: string) => {
        setPlayerChoice(choice);
    };

    const handleSubmit = async () => {
        if (playerChoice) {
            try {
                const result = await RockPaperScissorService.submitChoice(gameCode, playerChoice);
                if (result) {
                    onConfirm(playerChoice);
                } else {
                    console.error("Failed to submit choice");
                }
            } catch (error) {
                console.error("Failed to send choice to backend", error);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Choose Rock, Paper, or Scissors</h2>
                <div className="flex gap-4 mb-4">
                    {choices.map((choice) => (
                        <button
                            key={choice}
                            className={`px-4 py-2 font-bold text-white rounded-lg ${
                                playerChoice === choice ? "bg-blue-700" : "bg-blue-500"
                            }`}
                            onClick={() => handleChoice(choice)}
                        >
                            {choice}
                        </button>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button
                        className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg"
                        onClick={handleSubmit}
                    >
                        Confirm
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg"
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
