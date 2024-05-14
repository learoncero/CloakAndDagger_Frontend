import React, { useState } from "react";
import LeaveLobbyConfirmationPopup from "./LeaveLobbyConfirmationPopup";
import GameService from "@/services/GameService";
import {Game} from "@/app/types";
import {router} from "next/client";
import {useRouter} from "next/navigation";

type Props = {
    gameCode: string;
    playerUsername: string;
};

export default function LobbyLeaveButton({ gameCode, playerUsername }: Props) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const router = useRouter();

    const handleLeave = () => {
        setShowConfirmation(true);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    const handleConfirm = async () => {
        try {
            const response = await GameService.leaveGame(gameCode, playerUsername);

            if (response.data) {
                await router.push("/game/setup");
            }
        } catch (error: any) {
            console.error(error.message);
        } finally {
            setShowConfirmation(false);
        }
    };

    return (
        <>
            <button
                className="bg-black border border-red-500 text-white font-bold py-2 px-4 rounded-lg mt-4 hover:bg-red-700 hover:border-red-700"
                onClick={handleLeave}
            >
                Leave Lobby
            </button>
            {showConfirmation && (
                <LeaveLobbyConfirmationPopup
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    );
}
