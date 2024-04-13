"use server";

import GameService from "@/services/GameService";

export default async function fetchGame(gameCode: string) {
  const result = await GameService.getGame(gameCode as string);

  return result;
}
