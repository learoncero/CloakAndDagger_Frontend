import { Player, Role } from "@/app/types";

type Props = {
  playerList: Player[];
};

export default function ImpostorCounter({ playerList }: Props) {
  const impostors = playerList.filter(
    (player) => player.role === Role.IMPOSTOR
  );

  return (
    <div className="pt-4 pb-1 font-semibold font-sans text-lg">
      <h2>
        Beware! {impostors.length} Impostor{impostors.length !== 1 && "s"} among
        us!
      </h2>
    </div>
  );
}
