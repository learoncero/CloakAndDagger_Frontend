type Props = {
  gameCode: string | string[];
};

export default function LobbyGameCode({ gameCode }: Props) {
  return (
    <p className="text-lg font-bold mb-4">
      Game Code:{" "}
      <span className="bg-gray-800 rounded-lg p-2 text-lg font-bold">
        {gameCode}
      </span>
    </p>
  );
}
