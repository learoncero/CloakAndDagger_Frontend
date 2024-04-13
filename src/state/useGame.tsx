import { useState } from "react";
import { Game } from "@/app/types";

export default function useGame() {
  const [game, setGame] = useState<Game | null | undefined>(null);

  const updateGame = (newGame: Game | null | undefined) => {
    setGame(newGame);
  };

  return { game, updateGame };
}
