import ApiService from "@/services/ApiService";
import {ApiResponse} from "@/app/types";

export default class MiniGameDecipherSymbolsService {
    static async getShuffledSymbols(gameCode: string, taskId: number, currentRound: number) {
        const response = await ApiService.post(
            "minigame",
            `/api/decipher/${gameCode}/getShuffledSymbols`,
            {
                taskId,
                currentRound
            }
        );

        console.log("response", response as ApiResponse);

        return response as ApiResponse;
    }

    static async getCorrectSymbol(gameCode: string, taskId: number) {
        const response = await ApiService.post(
            "minigame",
            `/api/decipher/${gameCode}/getCorrectSymbol`,
            taskId
        );

        console.log("response", response as ApiResponse<string>);

        return response as ApiResponse<string>;
    }

    static async submitDecipherSymbol(gameCode: string, taskId: number, symbol: string, currentRound: number) {
        const response = await ApiService.post(
            "minigame",
            `/api/decipher/${gameCode}/submit`,
            {
                taskId,
                symbol,
                currentRound
            }
        );

        return response as ApiResponse<boolean>;
    }
}