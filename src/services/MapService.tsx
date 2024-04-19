import { ApiResponse, Map } from "@/app/types";
import ApiService from "./ApiService";

export default class MapService {
  static async getMap(mapName: string) {
    const map = await ApiService.fetch(`/api/map/${mapName}`);
    return map as ApiResponse<Map>;
  }
}
