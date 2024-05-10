import {Player} from "@/app/types";
import VotingButton from "./VotingButton";
import {useState} from "react";
import {number} from "prop-types";


type VotingProps = {
    activePlayers: Player[];
    handleVotes: (selectedPlayerId: string) => void;
    voteGiven: boolean;
}

export default function Voting ({activePlayers, handleVotes}: VotingProps) {
    const [selectedPlayerId, setSelectedPlayerId] = useState('');

    const handlePlayerSelection = (e: any) => {
        setSelectedPlayerId(e.target.value);
    }

    return (
        <div className={"relative"}>
            {voteGiven && (
                <div className="absolute inset-0 bg-gray-500 opacity-50 flex justify-center items-center z-10">
                    <div className={"text-white text-lg font-semibold"}>
                        Vote Sent!
                    </div>
                </div>
            )}
            <div className={"w-60 ml-5 p-4 border-2 border-white rounded-lg relative"}>
                <h2 className={"border-b pb-2 text-lg font-bold"}>
                    Who is the Impostor?
                </h2>
                <div className={"pt-2"}>
                    {activePlayers.map((player) =>
                        <div key={player.id}>
                            <input
                                type="radio"
                                id={Player.username}
                                name="selectedPlayerId"
                                value={Player.id}
                                checked={selectedPlayerId === Player.id.toString()}
                                onChange={handlePlayerSelection}
                                className={"scale-110 transform hover:scale-125 "}
                            />
                            <label htmlFor={Player.username} className={`ml-2 checked:text-cyan-500 ${selectedPlayerId === Player.id.toString() ? 'text-cyan-500' : 'text-white'}`}>{Player.username}</label>
                        </div>
                    </div>)}
                <div className={"flex justify-center mt-5"}>
                    <VotingButton handleVotes={handleVotes} selectedPlayerId={selectedPlayerId}/>
                </div>
            </div>
        </div>
    )
}