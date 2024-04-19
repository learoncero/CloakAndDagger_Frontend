import { useState } from "react";
import JoinGameFormInputField from "./JoinGameFormInputField";
import { useRouter } from "next/navigation";
import JoinGameFormSubmitButton from "./JoinGameFormSubmitButton";
import GameService from "@/services/GameService";
import toast, {Toaster} from "react-hot-toast";

export default function JoinGameForm() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const handlePlayerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlayerName(event.target.value);
  };

  const handleGameCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(event.target.value);
  };

  const isJoinDisabled = !(playerName && gameCode);

  const handleJoinGame = async () => {
    if (!isJoinDisabled) {
      try {
        const game = await GameService.joinGame(playerName, gameCode);

        const playerId = game.data?.players.find(
            (player: { username: string }) => player.username === playerName
        )?.id;

        if (playerId) {
          sessionStorage.setItem("playerId", String(playerId));
        }

        router.push("/game/setup/lobby/" + gameCode);
      } catch (error: any) {
        toast("Error joining game: " + error.message, {
          position: "bottom-right",
          style: {
            border: "2px solid black",
            padding: "16px",
            color: "white",
            backgroundColor: "#eF4444",
          },
          icon: "✖️",
        });
      }
    }
  };

  return (
    <div className="w-96 flex flex-col space-y-4">
      <form action={handleJoinGame}>
        <JoinGameFormInputField
          name={"playerName"}
          value={playerName}
          onChange={handlePlayerNameChange}
          type={"text"}
          placeholder={"Enter your name"}
          required={true}
        />
        <JoinGameFormInputField
          name={"gameCode"}
          value={gameCode}
          onChange={handleGameCodeChange}
          type={"text"}
          placeholder={"Enter game code"}
          maxLength={6}
          required={true}
        />
        <JoinGameFormSubmitButton isJoinDisabled={isJoinDisabled} />
      </form>
      <Toaster />
    </div>
  );
}
