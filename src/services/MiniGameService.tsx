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

  static async submitColorSequence(colors: string[], shuffledColors: string[], taskId: number, gameCode: string) {
    try {
      const response = await ApiService.post('task', `/api/colors/${gameCode}/submit`, {
        colors: colors,
        shuffledColors: shuffledColors,
        taskId
      });

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error submitting color sequence:', error);
      throw error;
    }
  }

  static async getInitialColors(gameCode: string, taskId: number) {
    try {
      const response = await ApiService.post('task', `/api/colors/${gameCode}/getInitialColors`, taskId);
      if (response.data) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Failed to start color sequence game:', error);
      throw error;
    }
  }

  static async getShuffledColors(gameCode: string, taskId: number) {
    try {
      const response = await ApiService.post('task', `/api/colors/${gameCode}/getShuffledColors`, taskId);
      if (response.data) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Failed to start color sequence game:', error);
      throw error;
    }
  }
}
