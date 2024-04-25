import { ApiResponse } from "@/app/types";
import ApiService from "./ApiService";

export default class TaskService {
    static async sumUp(value: number, gameCode: string) {
        const currentSum = await ApiService.post("task", `/api/task/${gameCode}/passcode/add`, { value });
        console.log("Sum:", currentSum);
        return currentSum as ApiResponse<number>;
    }

    static async getRandomSum(gameCode: string) {
        const randomSum = await ApiService.get("task", `/api/task/${gameCode}/passcode/random`);
        console.log("Random sum:", randomSum);
        return randomSum as ApiResponse<number>;
    }

    static async resetSum(gameCode: string) {
        const currentSum = await ApiService.post("task", `/api/task/${gameCode}/passcode/reset`);
        console.log("Reset sum:", currentSum);
        return currentSum as ApiResponse<number>;
    }

    static async getCurrentSum(gameCode: string) {
        const currentSum = await ApiService.get("task", `/api/task/${gameCode}/passcode/current`);
        console.log("Current sum:", currentSum);
        return currentSum as ApiResponse<number>;
    }
}