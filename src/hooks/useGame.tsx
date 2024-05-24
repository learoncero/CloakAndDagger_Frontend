import { useState, useCallback } from "react";
import { Game, Map } from "@/app/types";
import { fetchGame, fetchMap } from "@/app/game/[gameCode]/play/actions";

export default function useGame(gameCode: string) {
  const [game, setGame] = useState<Game>({} as Game);
  const [map, setMap] = useState<Map>({} as Map);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadGameData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const gameResult = await fetchGame(gameCode);
      if (gameResult && gameResult.status === 200) {
        setGame(gameResult.data as Game);

        const mapResult = await fetchMap(gameResult.data?.map as string);
        if (mapResult && mapResult.status === 200) {
          setMap(mapResult.data as Map);
        } else if (mapResult && mapResult.status === 404) {
          setError("Map not found");
        }
      } else {
        setError("Game not found");
      }
    } catch (e) {
      setError("Error loading game data");
    } finally {
      setLoading(false);
    }
  }, [gameCode]);

  const updateGame = useCallback((newGame: Game) => {
    setGame(newGame);
  }, []);

  return { game, map, loading, error, loadGameData, updateGame };
}
