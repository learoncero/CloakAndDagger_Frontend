import React, {useEffect} from "react";
import {Player} from "@/app/types";

type VotingResultsProps = {
    onCloseResultsPopup: () => void;
    votedPlayer: Player | undefined;
};

export default function VotingResultsPopup ({onCloseResultsPopup, votedPlayer}: VotingResultsProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onCloseResultsPopup();
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed flex justify-center items-center bg-black bg-opacity-75 z-50 border-2 border-white rounded-lg">
            <div className="bg-black rounded-lg p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4">Voting Results:</h2>
                <p>Username  voted out!</p>
                <h3 className={"mt-4 text-xl font-bold"}>Congratulations!</h3>
                <p>You eliminated an Impostor!!</p>
            </div>
        </div>
    );
};