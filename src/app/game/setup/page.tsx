import ChooseGameModeLink from "./ChooseGameModeLink";

export default function ChooseGameMode() {
  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="w-96 flex space-x-4">
        <ChooseGameModeLink href={"/game/setup/createGame"}>
          CREATE GAME
        </ChooseGameModeLink>
        <ChooseGameModeLink href={"/game/setup/joinGame"}>
          JOIN GAME
        </ChooseGameModeLink>
      </div>
    </div>
  );
}
