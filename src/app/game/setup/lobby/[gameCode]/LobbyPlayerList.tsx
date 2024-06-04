import { Game } from "@/app/types";
import { useEffect, useRef } from "react";

type Props = {
  game: Game;
};

const playerIcons: { [key: string]: string } = {
  red: "/Sprites/Red/RedIdle.png",
  black: "/Sprites/Black/BlackIdle.png",
  blue: "/Sprites/Blue/BlueIdle.png",
  pink: "/Sprites/Pink/PinkIdle.png",
  purple: "/Sprites/Purple/PurpleIdle.png",
  brown: "/Sprites/Brown/BrownIdle.png",
  turquoise: "/Sprites/Turquoise/TurquoiseIdle.png",
};

export default function LobbyPlayerList({ game }: Props) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [game.players]);

  return (
    <ul
      ref={listRef}
      className="list-none p-0 h-64 overflow-y-auto scrollbar-hide"
    >
      {game?.players?.map((player) => (
        <li
          key={player.id}
          className="mb-2 px-4 py-2 bg-gray-800 rounded-lg flex items-center"
        >
          <img
            src={playerIcons[player.playerColor]}
            alt={player.playerColor}
            className="w-6 h-6 mr-2"
          />
          {player.username}
        </li>
      ))}
    </ul>
  );
}
