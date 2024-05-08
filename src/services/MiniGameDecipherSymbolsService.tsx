import ApiService from "@/services/ApiService";
import {ApiResponse} from "@/app/types";

export default class MiniGameDecipherSymbolsService {
    static async getInitialSymbols(gameCode: string, taskId: number) {
        const response = await ApiService.post(
            "minigame",
            `/api/decipher/${gameCode}/getInitialSymbols`,
            taskId
        );

        return response as ApiResponse;
    }

    static async getShuffledSymbols(gameCode: string, taskId: number) {
        const response = await ApiService.post(
            "minigame",
            `/api/decipher/${gameCode}/getShuffledSymbols`,
            taskId
        );

        return response as ApiResponse;
    }

    static async getCorrectSymbol(gameCode: string, taskId: number) {
        const response = await ApiService.post(
            "minigame",
            `/api/decipher/${gameCode}/getCorrectSymbol`,
            taskId
        );

        return response as ApiResponse;
    }

    static async submitDecipherSymbol(symbol: string, taskId: number, gameCode: string) {
        const response = await ApiService.post(
            "minigame",
            `/api/decipher/${gameCode}/submit`,
            {
                symbol,
                taskId
            }
        );

        return response as ApiResponse;
    }
}