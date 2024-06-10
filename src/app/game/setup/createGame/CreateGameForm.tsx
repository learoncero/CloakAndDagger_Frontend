import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import CreateGameFormInputField from "./CreateGameFormInputField";
import CreateGameFormSubmitButton from "./CreateGameFormSubmitButton";
import CreateGameFormRadioButtons from "./CreateGameFormRadioButtons";

type Props = {
  onSubmit: (state: any, data: FormData) => Promise<any>;
};

export default function CreateGameForm({ onSubmit }: Props) {
  const [username, setUsername] = useState("");
  const [numPlayers, setNumPlayers] = useState(1);
  const [numImpostors, setNumImpostors] = useState(0);
  const [map, setMap] = useState("Spaceship");
  const [state, formAction] = useFormState(onSubmit, undefined);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [playerColor, setPlayerColor] = useState("Choose your color");
  const [playerNameError, setPlayerNameError] = useState("");
  const hasResponse = state !== undefined;
  const hasError = hasResponse && state.status !== 200;

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

    if (
      username &&
      !error &&
      numPlayers &&
      numImpostors >= 0 &&
      map &&
      playerColor != "Choose your color"
    ) {
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
  }, [username, numPlayers, numImpostors, map, playerColor]);

  return (
    <form action={formAction}>
      <CreateGameFormRadioButtons />
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
        name="playerColor"
        value={playerColor}
        onChange={(e) => setPlayerColor(e.target.value)}
        required={true}
        idleOptions={idleOptions}
        type="select"
      />
      <input type="hidden" name="playerColor" value={playerColor} />
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
        textOptions={["Spaceship", "Wormhole", "Jungle", "Basement"]}
      />
      <CreateGameFormSubmitButton buttonDisabled={buttonDisabled} />
    </form>
  );
}
