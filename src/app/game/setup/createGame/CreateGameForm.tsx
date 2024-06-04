import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import CreateGameFormInputField from "./CreateGameFormInputField";
import CreateGameFormSubmitButton from "./CreateGameFormSubmitButton";
import JoinGameFormInputField from "@/app/game/setup/joinGame/JoinGameFormInputField";

type Props = {
  onSubmit: (state: any, data: FormData) => Promise<any>;
};

export default function CreateGameForm({ onSubmit }: Props) {
  const [username, setUsername] = useState("");
  const [numPlayers, setNumPlayers] = useState(1);
  const [numImpostors, setNumImpostors] = useState(0);
  const [map, setMap] = useState("DevMap1");
  const [state, formAction] = useFormState(onSubmit, undefined);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [playerColor, setPlayerColor] = useState("");
  const [playerNameError, setPlayerNameError] = useState("");

  const hasResponse = state !== undefined;
  const hasError = hasResponse && state.status !== 200;

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

  useEffect(() => {
    const error = validateUsername(username);
    setPlayerNameError(error);

    if (username && !error && numPlayers && numImpostors >= 0 && map) {
      if (numImpostors > numPlayers / 2) {
        setNumImpostors(Math.floor(numPlayers / 2));
      }
      if (numImpostors === numPlayers / 2) {
        setNumImpostors(Math.floor(numPlayers / 2) - 1);
      }
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [username, numPlayers, numImpostors, map]);

  return (
    <form action={formAction}>
      <CreateGameFormInputField
        label="Player Name"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        required={true}
        maxLength={20}
      />
      {playerNameError && (
        <div style={{ maxWidth: "15rem" }}>
          <div className="text-red-600 text-sm mb-4 ">{playerNameError}</div>
        </div>
      )}
      <CreateGameFormInputField
        label="Player Color"
        name={"playerColor"}
        value={playerColor}
        onChange={(e) => setPlayerColor(e.target.value)}
        type={"select"}
        required={true}
        options={[
          "red",
          "black",
          "blue",
          "pink",
          "purple",
          "brown",
          "turquoise",
        ]}
      />
      <CreateGameFormInputField
        label="Number of Players"
        name="numPlayers"
        value={numPlayers}
        onChange={(e) => setNumPlayers(parseInt(e.target.value))}
        type="number"
        min={1}
        max={8}
        required={true}
      />
      <CreateGameFormInputField
        label="Number of Impostors"
        name="numImpostors"
        value={numImpostors}
        onChange={(e) => setNumImpostors(parseInt(e.target.value))}
        type="number"
        min={0}
        max={numPlayers / 2}
        required={true}
      />
      <CreateGameFormInputField
        label="Map"
        name="map"
        value={map}
        onChange={(e) => setMap(e.target.value)}
        type="select"
        required={true}
        options={["Spaceship", "Wormhole", "Jungle", "Basement"]}
      />
      <CreateGameFormSubmitButton buttonDisabled={buttonDisabled} />
    </form>
  );
}
