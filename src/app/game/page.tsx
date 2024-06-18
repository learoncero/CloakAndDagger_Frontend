"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
    return (
        <div className="relative min-h-screen bg-black flex justify-center items-center">
            <Link href={"/game/setup"} className="hover:opacity-75">
                <Image
                    className="transition duration-300 ease-in-out"
                    src="/logo-no-background-blue.png"
                    alt="Game Logo"
                    width={500}
                    height={276}
                />
            </Link>
            <div className="absolute bottom-0 right-0 p-4 text-white text-sm font-bold">
                Stable Release v1.0.0
            </div>
        </div>
    );
}
