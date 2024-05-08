import { ApiResponse, Game, Player } from "@/app/types";
import ApiService from "./ApiService";

export default class GameService {
  static async getGame(gameCode: string) {
    const game = await ApiService.fetch("game", `/api/game/${gameCode}`);
    return game as ApiResponse<Game>;
  }

  static async createGame(
    player: Player,
    numberOfPlayers: number,
    numberOfImpostors: number,
    map: string,
    playerColor: string,

  ) {
    const createdGame = await ApiService.post("game", "/api/game", {
      player,
      numberOfPlayers,
      numberOfImpostors,
      map,
      playerColor
    });

    return createdGame as ApiResponse<Game>;
  }

  static async joinGame(username: string, gameCode: string, playerColor: string) {
    const joinedGame = await ApiService.post("game", "/api/game/join", {
      username,
      position: {
        x: 10,
        y: 9,
      },
      gameCode,
      playerColor,
    });

    if (joinedGame.status !== 200) {
      throw new Error(joinedGame.data.message);
    }

    return joinedGame as ApiResponse<Game>;
  }
}
