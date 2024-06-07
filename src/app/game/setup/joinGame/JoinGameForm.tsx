import React, { ChangeEvent, useState } from "react";
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
  const [playerNameError, setPlayerNameError] = useState("");
  const [gameCodeError, setGameCodeError] = useState("");

  const idleOptions = [
    { value: "red", label: "Red", imgSrc: "/Sprites/Red/RedIdle.png" },
    { value: "black", label: "Black", imgSrc: "/Sprites/Black/BlackIdle.png" },
    { value: "blue", label: "Blue", imgSrc: "/Sprites/Blue/BlueIdle.png" },
    { value: "pink", label: "Pink", imgSrc: "/Sprites/Pink/PinkIdle.png" },
    {
      value: "purple",
      label: "Purple",
      imgSrc: "/Sprites/Purple/PurpleIdle.png",
    },
    { value: "brown", label: "Brown", imgSrc: "/Sprites/Brown/BrownIdle.png" },
    {
      value: "turquoise",
      label: "Turquoise",
      imgSrc: "/Sprites/Turquoise/TurquoiseIdle.png",
    },
  ];

  const handlePlayerNameChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setPlayerName(event.target.value);
    setPlayerNameError(validateUsername(event.target.value));
  };

  const handleGameCodeChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setGameCode(event.target.value);
    setGameCodeError(validateGameCode(event.target.value));
  };

  const handlePlayerColorChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setPlayerColor(event.target.value);
  };

  function validateUsername(name: string) {
    const regex = /^[a-zA-Z0-9._-]+$/;
    if (!name) {
      return "";
    }
    if (!regex.test(name)) {
      return "Username can only contain letters, numbers, -, ., and _.";
    }
    return "";
  }

  function validateGameCode(gameCode: string) {
    const regex = /^[A-Z0-9]+$/;
    if (!gameCode) {
      return "";
    }
    if (!regex.test(gameCode)) {
      return "Game code can only contain letters (A-Z) and numbers (0-9).";
    }
    return "";
  }

  const isJoinDisabled = !(
    playerName &&
    gameCode &&
    playerColor &&
    !playerNameError &&
    !gameCodeError
  );

  const handleJoinGame = async () => {
    if (!isJoinDisabled) {
      try {
        const game = await GameService.joinGame(
          playerName,
          gameCode,
          playerColor
        );
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
        {playerNameError && (
          <div style={{ maxWidth: "25rem" }}>
            <div className="text-red-600 text-sm mb-4 ">{playerNameError}</div>
          </div>
        )}
        <JoinGameFormInputField
            name={"playerColor"}
            value={playerColor}
            onChange={handlePlayerColorChange}
            type={"select"}
            placeholder={"Choose your Color"}
            required={true}
            options={idleOptions}
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
        {gameCodeError && (
          <div style={{ maxWidth: "25rem" }}>
            <div className="text-red-600 text-sm mb-4 ">{gameCodeError}</div>
          </div>
        )}
        <JoinGameFormSubmitButton isJoinDisabled={isJoinDisabled} />
      </form>
      <Toaster />
    </div>
  );
}
