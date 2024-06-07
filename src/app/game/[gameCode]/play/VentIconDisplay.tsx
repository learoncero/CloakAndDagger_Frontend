import Image from "next/image";
import {Role} from "@/app/types";

type VentProps = {
    isVentInteractable: boolean;
    role?: Role;
    isVisible: boolean;
}

export default function VentIconDisplay ({
    isVentInteractable,
    role,
    isVisible,
 }: VentProps) {
    const isImpostor = (role == Role.IMPOSTOR) || (role == Role.IMPOSTOR_GHOST);
    return (
        <div className={`flex place-content-center w-full h-full z-10 ${!isVisible ? "opacity-20" : ""}`}>
            <Image
                src={"/vent.png"}
                alt={"Vent"}
                width={100}
                height={100}
                className={`object-contain p-[10%]`}
            />
            {isVentInteractable && isImpostor &&(
                <div className="absolute top-1 right-2 text-black font-bold bg-white px-1 rounded-full">
                    V
                </div>
            )}
        </div>
    )
}