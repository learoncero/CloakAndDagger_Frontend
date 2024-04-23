import { ApiResponse, Game, Player } from "@/app/types";
import ApiService from "./ApiService";

export default class GameService {
  static async getGame(gameCode: string) {
    const game = await ApiService.fetch(`http://localhost:5010`, `/api/game/${gameCode}`);
    return game as ApiResponse<Game>;
  }

  static async createGame(
    player: Player,
    numberOfPlayers: number,
    numberOfImpostors: number,
    map: string
  ) {
    const createdGame = await ApiService.post(`http://localhost:5010`, "/api/game", {
      player,
      numberOfPlayers,
      numberOfImpostors,
      map,
    });

    return createdGame as ApiResponse<Game>;
  }

  static async joinGame(username: string, gameCode: string) {
    const joinedGame = await ApiService.post(`http://localhost:5010`, "/api/game/join", {
      username,
      position: {
        x: 10,
        y: 9,
      },
      gameCode,
    });

    if (joinedGame.status !== 200) {
      throw new Error(joinedGame.data.message);
    }

    return joinedGame as ApiResponse<Game>;
  }

}
