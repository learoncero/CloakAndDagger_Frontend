import { Player, Role } from "@/app/types";
import VotingButton from "./VotingButton";
import { useState } from "react";

type VotingProps = {
  currentPlayer: Player;
  activePlayers: Player[];
  handleVotes: (selectedPlayerId: number) => void;
};

export default function Voting({
  currentPlayer,
  activePlayers,
  handleVotes,
}: VotingProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(-1);
  const [voteGiven, setVoteGiven] = useState(false);

  function handleVoteGiven() {
    if (selectedPlayerId != -1) {
      handleVotes(selectedPlayerId);
      setVoteGiven(true);
      setSelectedPlayerId(-1);
    } else {
      alert("Please select a player to vote for!");
    }
  }

  return (
    <div className={"relative"}>
      {voteGiven && (
        <div className="absolute ml-5 rounded-lg inset-0 bg-gray-500 opacity-50 flex justify-center items-center z-10">
          <div className={"text-white text-lg font-semibold"}>Vote Sent!</div>
        </div>
      )}
      {(currentPlayer.role === Role.CREWMATE_GHOST ||
        currentPlayer.role === Role.IMPOSTOR_GHOST) && (
        <div className="absolute ml-5 rounded-lg inset-0 bg-gray-500 opacity-50 flex justify-center items-center z-10"></div>
      )}
      <form>
        <div
          className={"w-60 ml-5 p-4 border-2 border-white rounded-lg relative"}
        >
          <h2 className={"border-b pb-2 text-lg font-bold"}>
            Who is the Impostor?
          </h2>
          <div className={"pt-2"}>
            {activePlayers.map((player) => (
              <div key={player.id}>
                <input
                  type="radio"
                  id={`${player.id}`}
                  name="votedFor"
                  value={player.id}
                  checked={selectedPlayerId === player.id}
                  onChange={() => setSelectedPlayerId(player.id)}
                  disabled={currentPlayer.id == player.id}
                  className={
                    "scale-110 transform hover:scale-125 disabled:text-gray-400"
                  }
                />
                <label
                  htmlFor={`${player.id}`}
                  className={`ml-2 checked:text-cyan-500 ${
                    selectedPlayerId === player.id
                      ? "text-cyan-500"
                      : "text-white"
                  }`}
                >
                  {player.username}
                </label>
              </div>
            ))}
            <div className={"flex justify-center mt-5"}>
              <VotingButton onClick={() => handleVoteGiven()} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
