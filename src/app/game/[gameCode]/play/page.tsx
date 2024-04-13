"use client";

import Stomp from "stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Player } from "@/app/types";
import ImpostorView from "./ImpostorView";
import CrewmateView from "./CrewmateView";
import MapDisplay from "./MapDisplay";
import useGame from "@/state/useGame";
import { useParams } from "next/navigation";
import fetchGame from "./actions";

export default function PlayGame() {
  const { gameCode } = useParams();
  console.log(gameCode);
  const [stompClient, setStompClient] = useState<any>(null);
  const { game, updateGame } = useGame();

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
    const playerIdCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("playerId="));
    if (playerIdCookie) {
      const playerId = playerIdCookie.split("=")[1];
      // Send move message to server
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

  const playerIdCookie = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("playerId="));
  const playerId = playerIdCookie
    ? parseInt(playerIdCookie.split("=")[1])
    : null;
  const playerIndex = game?.players.findIndex(
    (player) => player.id === playerId
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <h4>List of players:</h4>
      <ul>
        {game?.players.map((player) => (
          <li key={player.id}>
            Username: {player.username}
            {player.id === playerId ? " (you)" : ""}
          </li>
        ))}
      </ul>
      {/*TODO: implement ID search with Cookies*/}
      {game?.players?.at(playerIndex ?? -1)?.role === "Impostor" ? (
        <ImpostorView sabotages={game.sabotages} />
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
