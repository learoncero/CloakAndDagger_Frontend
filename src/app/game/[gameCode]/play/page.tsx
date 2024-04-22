"use client";

import Stomp from "stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Game, GameStatus, Player, Role, Map } from "@/app/types";
import ImpostorView from "./ImpostorView";
import CrewmateView from "./CrewmateView";
import MapDisplay from "./MapDisplay";
import useGame from "@/state/useGame";
import { useParams } from "next/navigation";
import { fetchGame, fetchMap } from "./actions";
import GameService from "@/services/GameService";
import Modal from "@/components/Modal";
import BackLink from "@/components/BackLink";

export default function PlayGame() {
  const { gameCode } = useParams();
  const [stompClient, setStompClient] = useState<any>(null);
  const { game, updateGame } = useGame();
  const [map, setMap] = useState<Map>({} as Map);

  const playerId = sessionStorage.getItem("playerId");
  const playerIndex = game?.players?.findIndex(
    (player) => player.id.toString() === playerId
  );
  const currentPlayer = game?.players?.find(
    (player) => player.id.toString() === playerId
  );
  const playerRole = game?.players?.[playerIndex as number]?.role ?? "";

  async function loadGameData() {
    const gameResult = await fetchGame(gameCode as string);
    console.log(gameResult);
    updateGame(gameResult.data as Game);

    const mapResult = await fetchMap(gameResult.data?.map as string);
    if (mapResult.status === 200) {
      setMap(mapResult.data as Map);
    } else if (mapResult.status === 404) {
      console.error("Map not found");
    }
  }

  useEffect(() => {
    if (!stompClient) {
      const socket = new SockJS("http://localhost:5010/ws");
      const client = Stomp.over(socket);
      client.connect({}, () => {
        setStompClient(client);
      });

      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    }

    loadGameData().then((r) => console.log("Game loaded"));
  }, [stompClient]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stompClient, game?.players]);

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe(
        "/topic/positionChange",
        (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          updateGame(receivedMessage.body);
        }
      );

      stompClient.subscribe(
        "/topic/playerKill",
        (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          updateGame(receivedMessage.body);
        }
      );
    }
  }, [stompClient]);

  function handleKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;
    const validKeyCodes = ["KeyA", "KeyW", "KeyD", "KeyS"];
    if (
      playerId &&
      validKeyCodes.includes(keyCode) &&
      playerRole !== Role.CREWMATE_GHOST &&
      playerRole !== Role.IMPOSTOR_GHOST &&
      game?.gameStatus === GameStatus.IN_GAME
    ) {
      const moveMessage = {
        id: playerId,
        keyCode: keyCode,
        gameCode: game?.gameCode,
      };

      if (stompClient && (game?.players?.length ?? 0) > 0 && playerId) {
        stompClient.send("/app/move", {}, JSON.stringify(moveMessage));
      }
    }
  }

  async function killPlayer(gameCode: string, playerToKillId: number) {
    const killMessage = {
      gameCode: gameCode,
      playerToKillId: playerToKillId,
    };
    if (stompClient) {
      stompClient.send(`/app/game/kill`, {}, JSON.stringify(killMessage));
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <h4>List of players:</h4>
      <ul>
        {game?.players?.map((player) => (
          <li key={player.id}>
            Username: {player.username}
            {player.id.toString() === playerId ? " (you)" : ""}
          </li>
        ))}
      </ul>
      {game?.gameStatus === GameStatus.IMPOSTORS_WIN ? (
        <Modal modalText={"IMPOSTORS WIN!"}>
          <BackLink href={"/"}>Return to Landing Page</BackLink>
        </Modal>
      ) : game?.gameStatus === GameStatus.CREWMATES_WIN ? (
        <h1>Crewmates win!</h1>
      ) : currentPlayer ? (
        <div>
          {playerRole === Role.IMPOSTOR ? (
            <ImpostorView
              sabotages={game?.sabotages}
              map={map.map}
              playerList={game?.players as Player[]}
              currentPlayer={currentPlayer}
              game={game}
              killPlayer={killPlayer}
            />
          ) : playerRole === Role.CREWMATE_GHOST ? (
            <Modal modalText={"GAME OVER!"}>
              <BackLink href={"/"}>Return to Landing Page</BackLink>
            </Modal>
          ) : (
            <CrewmateView
              map={map.map}
              playerList={game?.players as Player[]}
              currentPlayer={currentPlayer}
              game={game}
            />
          )}
          {map && map.map ? (
            <MapDisplay
              map={map.map}
              playerList={game?.players as Player[]}
              currentPlayer={currentPlayer}
            />
          ) : (
            <div>Loading map...</div>
          )}
        </div>
      ) : (
        <div>No Player Data Found</div>
      )}
    </div>
  );
}
