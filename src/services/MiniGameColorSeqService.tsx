import ApiService from "@/services/ApiService";

export default class MiniGameColorSeqService {
    static async submitColorSequence(colors: string[], shuffledColors: string[], taskId: number, gameCode: string) {
        try {
            const response = await ApiService.post('minigame', `/api/colors/${gameCode}/submit`, {
                colors: colors,
                shuffledColors: shuffledColors,
                taskId
            });

            return response.status === 200;
        } catch (error) {
            throw error;
        }
    }

    static async getInitialColors(gameCode: string, taskId: number) {
        try {
            const response = await ApiService.post('minigame', `/api/colors/${gameCode}/getInitialColors`, taskId);
            if (response.data) {
                return response.data;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            throw error;
        }
    }

    static async getShuffledColors(gameCode: string, taskId: number) {
        try {
            const response = await ApiService.post('minigame', `/api/colors/${gameCode}/getShuffledColors`, taskId);
            if (response.data) {
                return response.data;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            throw error;
        }
    }
}