import React, {useEffect} from "react";
import {Player, Role, VoteEvent} from "@/app/types";
import WhoVotedWhoList from "./WhoVotedWhoList";

type VotingResultsProps = {
    onCloseResultsPopup: () => void;
    voteResult: number | undefined;
    players: Player[];
    voteEvents: VoteEvent[];
};

export default function VotingResultsPopup ({onCloseResultsPopup, voteResult, players, voteEvents}: VotingResultsProps) {
    const zeroVotes = voteResult === 0;
    const isVoteTied = voteResult === -1;
    const votedPlayer = players.find(player => player.id === voteResult);

    useEffect(() => {
        const timer = setTimeout(() => {
            onCloseResultsPopup();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 z-50 border-2 border-white rounded-lg">
            <div className="bg-black rounded-lg p-8 max-w-md">
                {isVoteTied && (
                <>
                    <h2 className="text-2xl font-bold mb-4">There was a tie!!</h2>
                    <p>No one was voted out.</p>
                </>
                )}
                {zeroVotes && (
                <>
                    <h2 className="text-2xl font-bold mb-4">No Votes Given</h2>
                    <p>No one was voted out! Keep playing!</p>
                </>
                )}
                {votedPlayer && (
                <>
                    <h2 className="text-2xl font-bold mb-4">Voting Results:</h2>
                    <p>{votedPlayer.username} voted out!</p>
                    {votedPlayer?.role === Role.IMPOSTOR_GHOST
                    ? (
                    <>
                        <h3 className={"mt-4 text-xl font-bold"}>Congratulations!</h3>
                        <p>You eliminated an Impostor!!</p>
                    </>
                    ): (
                    <>
                        <h3 className={"mt-4 text-xl font-bold"}>Bad Luck!</h3>
                        <p>You eliminated a fellow Crewmate!!</p>
                    </>
                    )}
                    <br/>
                    <hr/>
                    <p className={"mt-2"}>Who got voted?</p>
                    <WhoVotedWhoList players={players} voteEvents={voteEvents}/>
                </>
                )}
            </div>
        </div>
    );
};