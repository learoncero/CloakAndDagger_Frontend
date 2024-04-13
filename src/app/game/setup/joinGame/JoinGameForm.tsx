import { ChangeEvent, useState } from "react";
import JoinGameFormInputField from "./JoinGameFormInputField";
import { useRouter } from "next/navigation";
import JoinGameFormSubmitButton from "./JoinGameFormSubmitButton";

type Props = {
  stompClient: any;
};

export default function JoinGameForm({ stompClient }: Props) {
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

  const handleJoinGame = () => {
    if (!isJoinDisabled && stompClient) {
      const data = {
        username: playerName,
        position: {
          x: 10,
          y: 9,
        },
        gameCode: gameCode,
      };

      stompClient.send("/app/joinGame", {}, JSON.stringify(data));

      // Redirect to lobby
      router.push("/game/setup/lobby/" + gameCode);
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
    </div>
  );
}
