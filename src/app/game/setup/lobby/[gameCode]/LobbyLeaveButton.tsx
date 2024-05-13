import React, { useState } from "react";
import LeaveLobbyConfirmationPopup from "./LeaveLobbyConfirmationPopup";

export default function LobbyLeaveButton() {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleLeave = () => {
        setShowConfirmation(true);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    const handleConfirm = () => {
        alert("Not implemented yet!");
        setShowConfirmation(false);
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
