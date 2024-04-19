import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import CreateGameFormInputField from "./CreateGameFormInputField";
import CreateGameFormSubmitButton from "./CreateGameFormSubmitButton";

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

  // Check if the form has a response and if the response status is not 200
  // Todo: should we handle error?
  const hasResponse = state !== undefined;
  const hasError = hasResponse && state.status !== 200;

  useEffect(() => {
    if (username && numPlayers && numImpostors >= 0 && map) {
      if (numImpostors > numPlayers / 2) {
        setNumImpostors(Math.floor(numPlayers / 2));
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
        options={["DevMap1", "DevMap2", "Spaceship"]}
      />
      <CreateGameFormSubmitButton buttonDisabled={buttonDisabled} />
    </form>
  );
}
