import ApiService from "@/services/ApiService";
import {ApiResponse} from "@/app/types";

export default class MiniGameSortingAlgorithmService {
    static async getShuffledBoxes(gameCode: string, taskId: number) {
        const response = await ApiService.post(
            "minigame",
            `/api/sorting/${gameCode}/getShuffledBoxes`,
            { taskId }
        );

        return response as ApiResponse<number[]>;
    }

    static async submitSortingAlgorithm(gameCode: string, taskId: number, boxes: number[]) {
        const response = await ApiService.post(
            "minigame",
            `/api/sorting/${gameCode}/submit`,
            { taskId, boxes }
        );

        return response as ApiResponse<boolean>;
    }
}