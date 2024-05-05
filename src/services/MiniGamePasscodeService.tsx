import ApiService from "@/services/ApiService";
import {ApiResponse} from "@/app/types";

export default class MiniGamePasscodeService {
    static async sumUp(value: number, taskId: number, gameCode: string) {
        const currentSum = await ApiService.post(
            "minigame",
            `/api/passcode/${gameCode}/add`,
            {
                value,
                taskId,
            }
        );

        return currentSum as ApiResponse<number>;
    }

    static async getRandomSum(gameCode: string, taskId: number) {
        const randomSum = await ApiService.post(
            "minigame",
            `/api/passcode/${gameCode}/random`,
            taskId
        );

        return randomSum as ApiResponse<number>;
    }

    static async resetSum(gameCode: string, taskId: number) {
        const currentSum = await ApiService.post(
            "minigame",
            `/api/passcode/${gameCode}/reset`,
            taskId
        );

        return currentSum as ApiResponse<number>;
    }
}