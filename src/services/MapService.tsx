import { ApiResponse, Map } from "@/app/types";
import ApiService from "./ApiService";

export default class MapService {
  static async getMap(mapName: string) {
    try {
      const response = await ApiService.fetch(`/api/map/${mapName}`);
      console.log("Response from MapService:", response);
      const mapData = response.data.map;
      const transformedMap = mapData.map((row: string) => row.split(''));
      const map = {
        id: response.data.id as number,
        map: transformedMap as string[][],
        name: response.data.name as string,
      }
      console.log("Transformed map:", map);
      return {
        status: response.status,
        data: map,
      } as ApiResponse<Map>;
    } catch (error) {
      console.error("Error in MapService: ", error);
    }
  }
}
