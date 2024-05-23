import React, {ChangeEvent, useState} from "react";
import JoinGameFormInputField from "./JoinGameFormInputField";
import { useRouter } from "next/navigation";
import JoinGameFormSubmitButton from "./JoinGameFormSubmitButton";
import GameService from "@/services/GameService";
import toast, { Toaster } from "react-hot-toast";

export default function JoinGameForm() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [playerColor, setPlayerColor] = useState("");

  const handlePlayerNameChange = (
      event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setPlayerName(event.target.value);
  };

  const handleGameCodeChange = (
      event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setGameCode(event.target.value);
  };

  const handlePlayerColorChange = (
      event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setPlayerColor(event.target.value);
  };

  const isJoinDisabled = !(playerName && gameCode);

  const handleJoinGame = async () => {
    if (!isJoinDisabled) {
      try {
        const game = await GameService.joinGame(playerName, gameCode, playerColor);
        const playerId = game.data?.players.find(
            (player: { username: string }) => player.username === playerName
        )?.id;

        if (playerId) {
          window.sessionStorage.setItem("playerId", String(playerId));
        }

        router.push("/game/setup/lobby/" + gameCode);
      } catch (error: any) {
        toast(`Error joining game: ${error.message}`, {
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
              maxLength={20}
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
          <JoinGameFormInputField
              name={"playerColor"}
              value={playerColor}
              onChange={handlePlayerColorChange}
              type={"select"}
              placeholder={"Choose your Color"}
              required={true}
              options={["red", "black", "blue","pink","purple","brown","turquoise"]}
          />
          <JoinGameFormSubmitButton isJoinDisabled={isJoinDisabled} />
        </form>
        <Toaster />
      </div>
  );
}
