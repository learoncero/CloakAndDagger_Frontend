import React from "react";

type Props = {
    onCancel: () => void;
    onConfirm: () => void;
};

export default function LeaveLobbyConfirmationPopup({ onCancel, onConfirm }: Props) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 border-white">
            <div className="bg-black p-8 rounded-lg">
                <p className="text-2xl font-bold mb-6">Are you sure you want to leave the lobby?</p>
                <div className="flex justify-end">
                    <button
                        className="bg-black border border-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 hover:border-gray-700 mr-4"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-black border border-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 hover:border-red-700"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
