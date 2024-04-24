import { ApiResponse } from "@/app/types";
import ApiService from "./ApiService";

export default class ChatService {
  static async getChat() {
    const chat = await ApiService.fetch("chat", "/api/chat");
    console.log("chat", chat);
    return chat;
  }
}
