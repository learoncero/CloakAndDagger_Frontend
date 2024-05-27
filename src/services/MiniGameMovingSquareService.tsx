import ApiService from "@/services/ApiService";
import {ApiResponse} from "@/app/types";

export default class MiniGameMovingSquareService {
    static async completeTask(gameCode: string, taskId: number) {
        const response = await ApiService.post(
            "minigame",
            `/api/moving-square/${gameCode}/complete`,
            { taskId }
        );

        return response as ApiResponse<boolean>;
    }
}