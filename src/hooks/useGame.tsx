import { useState } from "react";
import { Game } from "@/app/types";

export default function useGame() {
  const [game, setGame] = useState<Game>({} as Game);

  const updateGame = (newGame: Game) => {
    setGame(newGame);
  };

  return { game, updateGame };
}
