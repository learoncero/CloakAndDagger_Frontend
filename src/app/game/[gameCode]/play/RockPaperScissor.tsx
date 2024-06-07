import React, { useState } from "react";
import { sendDuelChoiceMessage } from "./PageSendFunctions";
import { Toaster } from "react-hot-toast";

type Props = {
    stompClient: any;
    gameCode: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const RockPaperScissor: React.FC<Props> = ({ stompClient, gameCode, onConfirm, onCancel }) => {
    const [playerChoice, setPlayerChoice] = useState<string | null>(null);
    const choices = ["Rock", "Paper", "Scissors"];

    const handleChoice = (choice: string) => {
        setPlayerChoice(choice);
    };

    const handleSubmit = async () => {
        if (playerChoice) {
            try {
                sendDuelChoiceMessage({ stompClient, gameCode, choice: playerChoice });

                onConfirm();
            } catch (error) {
                console.error("Error submitting choice:", error);
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                <div className="flex flex-col items-center bg-black rounded-lg p-8 max-w-md">
                    <div className="text-center mb-4">
                        <p className="text-xl font-bold text-white">Thug:</p>
                        <p className="text-lg text-white">Let us settle this like real fighters! Rock, Paper, Scissors, now!</p>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Choose Rock, Paper, or Scissors</h2>
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
            <Toaster />
        </>
    );
};

export default RockPaperScissor;
