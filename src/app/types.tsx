export type Game = {
  gameCode: string;
  numberOfPlayers: number;
  numberOfImpostors: number;
  map: boolean[][];
  players: Player[];
  gameID: number;
  sabotages: Sabotage[];
};

export type Player = {
  id: number;
  username: string;
  position: { x: number; y: number };
  role: string;
};

export type Sabotage = {
  id: number;
  title: string;
  description: string;
};

export type ApiResponse<Data = unknown> = {
  statusText: string;
  status?: number;
  data?: Data;
};
