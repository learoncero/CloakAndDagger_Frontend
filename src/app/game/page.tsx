"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black flex justify-center items-center">
            <Link href={"/game/setup"} className="hover:opacity-75">
                <Image
                    className="transition duration-300 ease-in-out"
                    src="/logo-no-background.png"
                    alt="Game Logo"
                    width={500}
                    height={276}
                />
            </Link>
        </div>
    );
}
