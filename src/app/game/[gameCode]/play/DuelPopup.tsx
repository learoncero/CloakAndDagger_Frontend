import React from "react";
import { Toaster } from "react-hot-toast";

type DuelPopupProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

export default function DuelPopup({ onConfirm, onCancel }: DuelPopupProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="flex flex-col items-center bg-black rounded-lg p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4">Duel Request</h2>
                <p className="text-lg">Do you want to Duel the Thugs?</p>
                <div className="flex w-full justify-between mt-4 gap-2">
                    <button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-lg"
                        onClick={onConfirm}
                    >
                        Ja
                    </button>
                    <button
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-lg"
                        onClick={onCancel}
                    >
                        Nein
                    </button>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
