import { Player, Role } from "@/app/types";

type Props = {
  playerList: Player[];
};

export default function CrewmateCounter({ playerList }: Props) {
  const crewmates = playerList.filter(
    (player) => player.role === Role.CREWMATE
  );
  const impostors = playerList.filter(
    (player) => player.role === Role.IMPOSTOR
  );

  return (
    <div className="pt-4 pb-1 font-semibold font-sans text-lg">
      <h2>
        Hunt down the Crewmates: {crewmates.length - impostors.length}{" "}
        remaining!
      </h2>
    </div>
  );
}
