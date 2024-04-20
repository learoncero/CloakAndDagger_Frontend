import { ApiResponse } from "@/app/types";
import ApiService from "./ApiService";

export default class TaskService {
    static async sendValue(value: number) {
        const sum = await ApiService.post(`/api/task/passcode/add`, { value });
        console.log("Sum:", sum);
        return sum as ApiResponse<number>;
    }
}