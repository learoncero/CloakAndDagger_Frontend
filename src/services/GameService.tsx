import { ApiResponse, Game, Player } from "@/app/types";
import ApiService from "./ApiService";

export default class GameService {
  static async getGame(gameCode: string) {
    const game = await ApiService.fetch(`/api/game/${gameCode}`);
    return game as ApiResponse<Game>;
  }

  static async createGame(
    player: Player,
    numberOfPlayers: number,
    numberOfImpostors: number,
    map: string
  ) {
    const createdGame = await ApiService.post("/api/game", {
      player,
      numberOfPlayers,
      numberOfImpostors,
      map,
    });

    return createdGame as ApiResponse<Game>;
  }
}
