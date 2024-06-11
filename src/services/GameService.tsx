import { ApiResponse, Game, GameMode, Player } from "@/app/types";
import ApiService from "./ApiService";

export default class GameService {
  static async getGame(gameCode: string) {
    const game = await ApiService.fetch("game", `/api/game/${gameCode}`);
    return game as ApiResponse<Game>;
  }

  static async createGame(
    username: String,
    numberOfPlayers: number,
    numberOfImpostors: number,
    map: string,
    playerColor: string,
    gameMode: GameMode
  ) {
    const createdGame = await ApiService.post("game", "/api/game", {
      username,
      numberOfPlayers,
      numberOfImpostors,
      map,
      playerColor,
      gameMode,
    });

    return createdGame as ApiResponse<Game>;
  }

  static async joinGame(
    username: string,
    gameCode: string,
    playerColor: string,
    gameMode: GameMode
  ) {
    const joinedGame = await ApiService.post("game", "/api/game/join", {
      username,
      position: {
        x: 10,
        y: 9,
      },
      gameCode,
      playerColor,
      gameMode,
    });

    if (joinedGame.status !== 200) {
      throw new Error(joinedGame.data.message);
    }

    return joinedGame as ApiResponse<Game>;
  }

  static async leaveGame(gameCode: string, playerUsername: string) {
    const leftGame = await ApiService.post(
      "game",
      `/api/game/${gameCode}/leave`,
      playerUsername
    );

    if (leftGame.status !== 200) {
      throw new Error(leftGame.data.message);
    }

    return leftGame as ApiResponse<boolean>;
  }
}
