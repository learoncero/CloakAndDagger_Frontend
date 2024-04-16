export type Game = {
  gameCode: string;
  numberOfPlayers: number;
  numberOfImpostors: number;
  map: boolean[][];
  players: Player[];
  gameID: number;
  sabotages: Sabotage[];
  gameStatus: GameStatus;
};

export type Player = {
  id: number;
  username: string;
  position: { x: number; y: number };
  role: Role;
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

export enum Role {
  CREWMATE = "CREWMATE",
  IMPOSTOR = "IMPOSTOR",
  CREWMATE_GHOST = "CREWMATE_GHOST",
  IMPOSTOR_GHOST = "IMPOSTOR_GHOST",
}

export enum GameStatus {
  CREWMATES_WIN = "CREWMATES_WIN",
  IMPOSTORS_WIN = "IMPOSTORS_WIN",
  NOT_FINISHED = "NOT_FINISHED",
}
