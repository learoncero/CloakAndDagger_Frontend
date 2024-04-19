import { Game, Player } from "@/app/types";
import PlayerListItem from "./PlayerListItem";

type Props = {
  playerId: number;
  playerList: Player[];
};

export default function PlayerList({ playerId, playerList }: Props) {
  return (
    <div className="sabotageList bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-lg min-h-64 min-w-80">
      <h2 className="text-lg font-semibold mb-4">List of Players</h2>
      <ul className="overflow-x-hidden">
        {playerList.map((player) =>
          PlayerListItem({
            username: player.username,
            currPlayer: player.id === playerId,
            key: player.id,
          })
        )}
      </ul>
    </div>
  );
}
