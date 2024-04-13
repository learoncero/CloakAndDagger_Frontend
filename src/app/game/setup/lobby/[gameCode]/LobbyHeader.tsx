import { Game } from "@/app/types";

type Props = {
  game: Game;
};

export default function LobbyHeader({ game }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-white">
        Players ({game.players.length}/{game?.numberOfPlayers})
      </h2>
      <hr className="border-white mb-4" />
    </div>
  );
}
