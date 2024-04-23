"use server";

import GameService from "@/services/GameService";
import MapService from "@/services/MapService";
import { revalidatePath } from "next/cache";

export async function fetchGame(gameCode: string) {
  const result = await GameService.getGame(gameCode as string);

  if (result.status === 200) {
    revalidatePath(`/game/${gameCode}/play`);
  }

  return result;
}

export async function fetchMap(mapName: string) {
  try  {
    const result = await MapService.getMap(mapName);
    return result;
  } catch (error) {
    console.error("Error in fetchMap: ", error);
  }

}
