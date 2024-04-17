"use server";

import GameService from "@/services/GameService";
import MapService from "@/services/MapService";

export async function fetchGame(gameCode: string) {
  const result = await GameService.getGame(gameCode as string);

  return result;
}
