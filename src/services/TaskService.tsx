import { ApiResponse } from "@/app/types";
import ApiService from "./ApiService";

export default class TaskService {
  static async startTask(taskId: number, miniGameId: number, gameCode: string) {
    const startedTask = await ApiService.post(
      "minigame",
      `/api/minigame/${gameCode}/start`,
      {
        taskId,
        miniGameId,
      }
    );

    return startedTask as ApiResponse;
  }

  static async cancelTask(
    taskId: number,
    miniGameId: number,
    gameCode: string
  ) {
    const cancelledTask = await ApiService.post(
      "minigame",
      `/api/minigame/${gameCode}/cancel`,
      {
        taskId,
        miniGameId,
      }
    );

    return cancelledTask as ApiResponse;
  }

  static async getActiveStatus(taskId: number, gameCode: string) {
    const status = await ApiService.post(
      "game",
      `/api/game/task/${gameCode}/status`,
      taskId
    );

    return status as ApiResponse;
  }

  static async setActiveStatus(taskId: number, gameCode: string) {
    const isActive = await ApiService.post(
      "game",
      `/api/game/task/${gameCode}/active`,
      taskId
    );

    return isActive as ApiResponse;
  }
}
