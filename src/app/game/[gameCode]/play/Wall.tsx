// Wall.tsx
import React from 'react';
import Image from "next/image";
type Props = {
    isWallInteractable: boolean;

};

export default function Wall({isWallInteractable}: Props) {
    return (
        <div className="w-13 h-13 md:w-16 md:h-16 lg:w-19 lg:h-19 absolute">
            <Image
                src={"/Sprites/AmongUS_Thug.png"}
                alt={"Sabotage"}
                width={100}
                height={100}
            />
            {isWallInteractable && (
                <div className="absolute top-1 right-2 text-black font-bold bg-white px-1 rounded-full">
                    G
                </div>
            )}
        </div>
    );
};






