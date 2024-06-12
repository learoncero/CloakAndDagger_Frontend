import { GameMode } from "@/app/types";
import React from "react";

type Props = {
  selectedGameMode: GameMode;
  handleGameModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function JoinGameFormRadioButtons({
  selectedGameMode,
  handleGameModeChange,
}: Props) {
  return (
    <ul className="grid w-full gap-6 md:grid-cols-2 mb-4">
      <li>
        <input
          type="radio"
          id="private"
          name="gameMode"
          value={GameMode.PRIVATE}
          className="hidden peer"
          checked={selectedGameMode === GameMode.PRIVATE}
          onChange={handleGameModeChange}
        />
        <label
          htmlFor="private"
          className={`inline-flex items-center justify-between w-full p-1 rounded-lg cursor-pointer border-2 ${
            selectedGameMode === GameMode.PRIVATE
              ? "bg-cyan-500 border-cyan-500"
              : "border-gray-700 hover:bg-gray-800"
          }`}
        >
          <div className="flex justify-center items-center w-full">
            <div className="text-lg font-semibold">PRIVATE</div>
          </div>
        </label>
      </li>
      <li>
        <input
          type="radio"
          id="public"
          name="gameMode"
          value={GameMode.PUBLIC}
          className="hidden peer"
          checked={selectedGameMode === GameMode.PUBLIC}
          onChange={handleGameModeChange}
          required
        />
        <label
          htmlFor="public"
          className={`inline-flex items-center justify-between w-full p-1 rounded-lg cursor-pointer border-2 ${
            selectedGameMode === GameMode.PUBLIC
              ? "bg-cyan-500 border-cyan-500"
              : "border-gray-700 hover:bg-gray-800"
          }`}
        >
          <div className="flex justify-center items-center w-full">
            <div className="text-lg font-semibold">PUBLIC</div>
          </div>
        </label>
      </li>
    </ul>
  );
}
