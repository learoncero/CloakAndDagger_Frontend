import { useState } from "react";
import { Game, Map } from "@/app/types";
import { fetchGame, fetchMap } from "@/app/game/[gameCode]/play/actions";

export default function useGame(gameCode: string) {
  const [game, setGame] = useState<Game>({} as Game);
  const [map, setMap] = useState<Map>({} as Map);

  async function loadGameData() {
    const gameResult = await fetchGame(gameCode);
    setGame(gameResult.data as Game);

    const mapResult = await fetchMap(gameResult.data?.map as string);
    if (mapResult && mapResult.status === 200) {
      setMap(mapResult.data as Map);
    } else if (mapResult && mapResult.status === 404) {
      console.error("Map not found");
    }
  }

  const updateGame = (newGame: Game) => {
    console.log("This is the new Game:" + newGame)
    setGame(newGame);
  };

  return { game, map, loadGameData, updateGame };
}
