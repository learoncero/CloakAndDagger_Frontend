import React, {useEffect, useState} from "react";
import LobbyLeaveConfirmationPopup from "./LobbyLeaveConfirmationPopup";
import GameService from "@/services/GameService";
import {useRouter} from "next/navigation";

type Props = {
    gameCode: string;
    playerUsername: string;
};

export default function LobbyLeave({ gameCode, playerUsername }: Props) {
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

    useEffect(() => {
        const handleBeforeUnload = async () => {
            try {
                await GameService.leaveGame(gameCode, playerUsername);
            } catch (error) {
                console.error("Error leaving lobby:", error);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [gameCode, playerUsername]);

    return (
        <>
            <button
                className="bg-black border border-red-500 text-white font-bold py-2 px-4 rounded-lg mt-4 hover:bg-red-700 hover:border-red-700"
                onClick={handleLeave}
            >
                Leave Lobby
            </button>
            {showConfirmation && (
                <LobbyLeaveConfirmationPopup
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    );
}
