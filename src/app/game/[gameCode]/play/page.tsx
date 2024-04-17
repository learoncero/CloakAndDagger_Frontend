"use client";

import Stomp from "stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Player, Role } from "@/app/types";
import ImpostorView from "./ImpostorView";
import CrewmateView from "./CrewmateView";
import MapDisplay from "./MapDisplay";
import useGame from "@/state/useGame";
import { useParams } from "next/navigation";
import GameOver from "./GameOver";
import { fetchGame } from "./actions";
import GameService from "@/services/GameService";

export default function PlayGame() {
  const { gameCode } = useParams();
  console.log("gameCode: ", gameCode);
  const [stompClient, setStompClient] = useState<any>(null);
  const { game, updateGame } = useGame();
  const playerId = sessionStorage.getItem("playerId");
  const playerIndex = game?.players.findIndex(
    (player) => player.id.toString() === playerId
  );
  const playerRole = game?.players[playerIndex as number]?.role;

  async function loadGameData() {
    const result = await fetchGame(gameCode as string);
    if (JSON.stringify(result.data) !== JSON.stringify(game)) {
      updateGame(result.data);
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

    loadGameData();
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
          updateGame(receivedMessage);
        }
      );
      // Subscribe to receive updated game state
      stompClient.subscribe(
        `/topic/${game?.gameCode}/play`,
        (message: { body: string }) => {
          const updatedGame = JSON.parse(message.body);
          updateGame(updatedGame);
        }
      );
      stompClient.send(`/app/${game?.gameCode}/play`, {}, JSON.stringify(game));
    }
  }, [stompClient]);

  function handleKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;
    const validKeyCodes = ["KeyA", "KeyW", "KeyD", "KeyS"];
    const playerId = sessionStorage.getItem("playerId"); //TODO: Change to cookie
    if (playerId && validKeyCodes.includes(keyCode)) {
      const currentPlayer = game?.players[playerIndex as number];
      if (currentPlayer) {
        const newPosition = {
          x: currentPlayer.position.x,
          y: currentPlayer.position.y,
        };

        switch (keyCode) {
          case "KeyA":
            newPosition.x -= 1;
            break;
          case "KeyW":
            newPosition.y -= 1;
            break;
          case "KeyD":
            newPosition.x += 1;
            break;
          case "KeyS":
            newPosition.y += 1;
            break;
          default:
            break;
        }

        const moveMessage = {
          id: playerId,
          keyCode: keyCode,
          gameCode: game?.gameCode,
          position: newPosition,
        };

        if (stompClient && game?.players.length && playerId) {
          stompClient.send("/app/move", {}, JSON.stringify(moveMessage));
        }
      }
    }
  }
  async function killPlayer(gameCode: string, playerToKillId: number) {
    const game = await GameService.handleKill(gameCode, playerToKillId);

    if (JSON.stringify(game.data) !== JSON.stringify(game)) {
      updateGame(game.data);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <h4>List of players:</h4>
      <ul>
        {game?.players.map((player) => (
          <li key={player.id}>
            Username: {player.username}
            {player.id.toString() === playerId ? " (you)" : ""}
          </li>
        ))}
      </ul>
      {playerRole === Role.IMPOSTOR ? (
        <ImpostorView 
          sabotages={game?.sabotages}
          game={game}
          killPlayer={killPlayer}
        />
      ) : playerRole === Role.CREWMATE_GHOST ? (
        <GameOver />
      ) : (
        <CrewmateView />
      )}
      <MapDisplay
        map={game?.map as boolean[][]}
        playerList={game?.players as Player[]}
      />
    </div>
  );
}
