import React from "react";

type Props = {
  username: string;
  currPlayer: boolean;
  isGhost: boolean;
  color: string;
  key: number;
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

export default function PlayerListItem({
  username,
  currPlayer,
  isGhost,
  color,
  key
}: Props) {
  return (
    <li key={key} className="bg-gray-700 bg-opacity-70 rounded-md p-2 mb-2 flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={playerIcons[color]} alt={color} className="w-6 h-6 mr-2" />
      {currPlayer ? (
        <span className="font-semibold text-cyan-500">{username}</span>
      ) : isGhost ? (
        <span className="font-semibold text-gray-500 italic">{username}</span>
      ) : (
        <span className="font-semibold">{username}</span>
      )}
    </li>
  );
}
