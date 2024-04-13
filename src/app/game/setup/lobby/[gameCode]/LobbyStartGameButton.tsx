type Props = {
  handleStartGame: () => void;
  isGameReadyToStart: boolean;
};

export default function LobbyStartGameButton({
  handleStartGame,
  isGameReadyToStart,
}: Props) {
  return (
    <button
      onClick={handleStartGame}
      className={`bg-transparent border border-white ${
        isGameReadyToStart ? "hover:border-black hover:bg-cyan-500" : ""
      } text-white font-bold py-2 px-4 rounded-lg mt-4`}
      disabled={!isGameReadyToStart}
    >
      Start Game
    </button>
  );
}
