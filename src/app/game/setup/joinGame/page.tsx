"use client";

import BackLink from "@/components/BackLink";
import JoinGameForm from "./JoinGameForm";
import JoinGameModeTab from "./JoinGameModeTab";
import { useState } from "react";

export default function JoinGame() {
  const [gameModeIndex, setGameModeIndex] = useState(0);

  function onGameModeChange(index: number) {
    setGameModeIndex(index);
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex justify-center mt-52 mb-10">
        <div className="inline-flex gap-12">
          <JoinGameModeTab
            label="PRIVATE"
            isActive={gameModeIndex === 0}
            tabIndex={0}
            onGameModeChange={() => onGameModeChange(0)}
          />
          <JoinGameModeTab
            label="PUBLIC"
            isActive={gameModeIndex === 1}
            tabIndex={1}
            onGameModeChange={() => onGameModeChange(1)}
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-md w-full bg-black px-8 pb-4 rounded-lg border border-white">
          <BackLink href={"/game/setup"}>Back</BackLink>
          <JoinGameForm gameModeIndex={gameModeIndex} />
        </div>
      </div>
    </div>
  );
}
