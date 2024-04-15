"use client";

import BackLink from "@/components/BackLink";
import JoinGameForm from "./JoinGameForm";

export default function JoinGame() {
  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="max-w-md text-white p-8 rounded-lg border-white border">
        <BackLink href={"/game/setup"}>Back</BackLink>
        <JoinGameForm/>
      </div>
    </div>
  );
}
