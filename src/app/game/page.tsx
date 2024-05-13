"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <Link
        href={"/game/setup"}
        className="text-white hover:text-cyan-500 text-7xl font-bold"
      >
        PLAY
      </Link>
    </div>
  );
}
