import { ApiResponse, Chat } from "@/app/types";
import ApiService from "./ApiService";

export default class ChatService {
  static async endChat(gameCode: string) {
    await ApiService.post("chat", `/api/${gameCode}/chat/end`, {});
  }
}
