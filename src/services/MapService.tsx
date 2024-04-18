import { ApiResponse } from "@/app/types";
import ApiService from "./ApiService";

export default class MapService {
  static async getMap(mapName: string) {
    const map = await ApiService.fetch(`/map/${mapName}`);
    return map as ApiResponse<boolean[][]>;
  }
}
