import { Game } from "@/app/types";

type Props = {
  isGameReadyToStart: boolean;
};

export default function LobbyReadyToStartText({ isGameReadyToStart }: Props) {
  return (
    <div>
      {isGameReadyToStart ? (
        <p className="pb-4">You can start the game!</p>
      ) : (
        <p className="pb-4">Waiting for players...</p>
      )}
    </div>
  );
}
