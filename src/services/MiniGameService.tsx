import { ApiResponse } from "@/app/types";
import ApiService from "./ApiService";

export default class MiniGameService {
  static async startTask(taskId: number, miniGameId: number, gameCode: string) {
    const startedTask = await ApiService.post(
      "task",
      `/api/minigame/${gameCode}/start`,
      {
        taskId,
        miniGameId,
      }
    );
    console.log("Task started: ", startedTask);
    return startedTask as ApiResponse;
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

  static async sumUp(value: number, taskId: number, gameCode: string) {
    const currentSum = await ApiService.post(
      "task",
      `/api/passcode/${gameCode}/add`,
      {
        value,
        taskId,
      }
    );
    console.log("Sum:", currentSum.data);
    return currentSum as ApiResponse<number>;
  }

  static async getRandomSum(gameCode: string, taskId: number) {
    const randomSum = await ApiService.post(
      "task",
      `/api/passcode/${gameCode}/random`,
      taskId
    );
    console.log("Random sum:", randomSum);
    return randomSum as ApiResponse<number>;
  }

  static async resetSum(gameCode: string, taskId: number) {
    const currentSum = await ApiService.post(
      "task",
      `/api/passcode/${gameCode}/reset`,
      taskId
    );
    console.log("Reset sum:", currentSum);
    return currentSum as ApiResponse<number>;
  }
}
