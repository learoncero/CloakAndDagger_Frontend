import ApiService from "@/services/ApiService";

export default class RockPaperScissorService {
    static async submitChoice(gameCode: string, choice: string) {
        console.log("THis is my choice:" + choice);
        try {
            const response = await ApiService.post('game', `/api/colors/${gameCode}/submitDuelChoice`, { choice });
            return response.status === 200;
        } catch (error) {
            throw error;
        }
    }

    static async getResult(gameCode: string) {
        try {
            const response = await ApiService.post('game', `/api/colors/${gameCode}/getDuelResult`);
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
