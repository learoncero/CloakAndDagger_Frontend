import { Game } from "@/app/types";
import {useEffect, useRef} from "react";

type Props = {
  game: Game;
};

export default function LobbyPlayerList({ game }: Props) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [game.players]);

  return (
    <ul ref={listRef} className="list-none p-0 h-64 overflow-y-auto">
      {game?.players?.map((player) => (
        <li key={player.id} className="mb-2 px-4 py-2 bg-gray-800 rounded-lg">
          {player.username}
        </li>
      ))}
    </ul>
  );
}
