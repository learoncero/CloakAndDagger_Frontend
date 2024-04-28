type Props = {
  username: string;
  currPlayer: boolean;
  key: number;
  isGhost: boolean;
};

export default function PlayerListItem({
  username,
  currPlayer,
  key,
  isGhost,
}: Props) {
  return (
    <li key={key} className="bg-gray-700 bg-opacity-70 rounded-md p-2 mb-2">
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
