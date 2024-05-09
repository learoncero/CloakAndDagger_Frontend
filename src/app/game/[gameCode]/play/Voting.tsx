import {Player} from "@/app/types";
import VotingButton from "./VotingButton";
import {useState} from "react";
import {number} from "prop-types";


type VotingProps = {
    activePlayers: Player[];
    handleVoting: (selectedPlayerId: number) => void;
}

export default function Voting ({activePlayers, handleVoting}: VotingProps) {
    const [selectedPlayerId, setSelectedPlayerId] = useState('');

    const handlePlayerSelection = (e: any) => {
        setSelectedPlayerId(e.target.value);
    }

    return (
        <div className={"w-60 ml-5 p-4 border-2 border-white rounded-lg relative"}>
            <h2 className={"border-b pb-2 text-lg font-bold"}>
                Who is the Impostor?
            </h2>
            <div className={"pt-2"}>
                {activePlayers.map((Player, index) =>
                    <div key={index}>
                        <div key={index}>
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
                    <VotingButton handleVoting={handleVoting} />
                </div>
            </div>
        </div>
    )
}