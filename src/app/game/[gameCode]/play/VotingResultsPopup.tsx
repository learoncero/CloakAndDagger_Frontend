import React, {useEffect} from "react";
import {Player} from "@/app/types";

type VotingResultsProps = {
    onCloseResultsPopup: () => void;
    isVoteTied: boolean;
    votedPlayer: Player | undefined;
};

export default function VotingResultsPopup ({onCloseResultsPopup, isVoteTied, votedPlayer}: VotingResultsProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onCloseResultsPopup();
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed flex justify-center items-center bg-black bg-opacity-75 z-50 border-2 border-white rounded-lg">
            <div className="bg-black rounded-lg p-8 max-w-md">
                {isVoteTied
                ?
                <>
                    <h2 className="text-2xl font-bold mb-4">There was a tie!!</h2>
                    <p>No one was voted out.</p>
                </>
                :
                <>
                    <h2 className="text-2xl font-bold mb-4">Voting Results:</h2>
                    <p>${votedPlayer?.username} voted out!</p>
                    {votedPlayer?.role === "IMPOSTOR"
                    ?
                    <>
                        <h3 className={"mt-4 text-xl font-bold"}>Congratulations!</h3>
                        <p>You eliminated an Impostor!!</p>
                    </>
                    :
                    <>
                        <h3 className={"mt-4 text-xl font-bold"}>Bad Luck!</h3>
                        <p>You eliminated a fellow Crewmate!!</p>
                    </>
                    }
                </>
                }
            </div>
        </div>
    );
};