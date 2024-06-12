"use server";

import { GameMode } from "@/app/types";
import GameService from "@/services/GameService";
import { revalidatePath } from "next/cache";

export default async function onSubmit(state: any, data: FormData) {
  const username = data.get("username") as string;
  const numberOfPlayers = parseInt(data.get("numPlayers") as string);
  const numberOfImpostors = parseInt(data.get("numImpostors") as string);
  const map = data.get("map") as string;
  const playerColor = data.get("playerColor") as string;
  const gameMode = data.get("gameMode") as GameMode;

  const result = await GameService.createGame(
    username,
    numberOfPlayers,
    numberOfImpostors,
    map,
    playerColor,
    gameMode
  );

  if (result.status === 200) {
    revalidatePath("/lobby/" + result.data?.gameCode);
  }

  return result;
}
