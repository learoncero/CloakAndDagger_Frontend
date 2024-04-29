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

  static async sumUp(value: number, taskId: number, gameCode: string) {
    const currentSum = await ApiService.post(
      "task",
      `/api/passcode/${gameCode}/add`,
      { value, taskId }
    );
    console.log("Sum:", currentSum);
    return currentSum as ApiResponse<number>;
  }

  static async getRandomSum(gameCode: string, taskId: number) {
    const randomSum = await ApiService.post(
      "task",
      `/api/passcode/${gameCode}/random`,
      { taskId }
    );
    console.log("Random sum:", randomSum);
    return randomSum as ApiResponse<number>;
  }

  static async resetSum(gameCode: string) {
    const currentSum = await ApiService.post(
      "task",
      `/api/passcode/${gameCode}/reset`
    );
    console.log("Reset sum:", currentSum);
    return currentSum as ApiResponse<number>;
  }
}
