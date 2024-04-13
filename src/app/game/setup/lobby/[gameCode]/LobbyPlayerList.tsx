import { Game } from "@/app/types";

type Props = {
  game: Game;
};

export default function LobbyPlayerList({ game }: Props) {
  return (
    <ul className="list-none p-0">
      {game.players.map((player) => (
        <li key={player.id} className="mb-2 px-4 py-2 bg-gray-800 rounded-lg">
          {player.username}
        </li>
      ))}
    </ul>
  );
}
