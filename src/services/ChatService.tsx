import { ApiResponse, Chat } from "@/app/types";
import ApiService from "./ApiService";

export default class ChatService {
  static async startChat(gameCode: string) {
    const chat = await ApiService.post("chat", `/api/${gameCode}/chat`, {});

    return chat as ApiResponse<Chat>;
  }
}
