import Image from "next/image";
import { Role } from "@/app/types";

type VentProps = {
  isVentInteractable: boolean;
  role?: Role;
  isVisible: boolean;
  mapName: string;
};

export default function VentIconDisplay({
  isVentInteractable,
  role,
  isVisible,
  mapName,
}: VentProps) {
  const isImpostor = role == Role.IMPOSTOR || role == Role.IMPOSTOR_GHOST;

  // Determine the image source based on the map name
  const imageSrc =
    mapName === "Jungle"
      ? "/ventImages/jungle.png"
      : mapName === "Spaceship"
      ? "/ventImages/spaceship.png"
      : mapName === "Basement"
      ? "/ventImages/basement.png"
      : "/ventImages/pirateShip.png";

  return (
    <div
      className={`flex place-content-center w-full h-full z-10 ${
        !isVisible ? "opacity-20" : ""
      }`}
    >
      <Image
        src={imageSrc}
        alt={"Vent"}
        width={100}
        height={100}
        className={`object-contain p-[10%]`}
      />
      {isVentInteractable && isImpostor && (
        <div className="absolute top-1 right-2 text-black font-bold bg-white px-1 rounded-full">
          V
        </div>
      )}
    </div>
  );
}
