"use client";

import useGame from "@/state/useGame";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import LobbyStartGameButton from "./LobbyStartGameButton";
import LobbyGameCode from "./LobbyGameCode";
import LobbyPlayerList from "./LobbyPlayerList";
import LobbyReadyToStartText from "./LobbyReadyToStartText";
import LobbyHeader from "./LobbyHeader";
import fetchGame from "./actions";

export default function Lobby() {
  const [stompClient, setStompClient] = useState<any>(null);
  const router = useRouter();
  const { gameCode } = useParams();
  const { game, updateGame } = useGame();

  async function loadGameData() {
    const result = await fetchGame(gameCode as string);
    if (result.status === 200) {
      updateGame(result.data);
    }
  }

  // Set up polling to refresh lobby data every 5 seconds
  useEffect(() => {
    loadGameData();

    const intervalId = setInterval(() => {
      loadGameData();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
    if (!stompClient) return;

    stompClient.subscribe("/topic/" + gameCode + "/play", function () {
      router.push("/game/" + game?.gameCode + "/play");
    });
  }, [stompClient, updateGame]);

  function handleStartGame() {
    if (stompClient && gameCode && game) {
      console.log("Starting game: ", game);
      stompClient.send(`/app/${gameCode}/play`, {}, JSON.stringify(game));
    }
  }

  if (!game) {
    return <div>Loading...</div>;
  }

  const isGameReadyToStart = game?.numberOfPlayers === game?.players.length;

  return (
    <div className="min-h-screen bg-black flex justify-center pl-5 items-center gap-10">
      <div className="max-w-xl text-white p-8 rounded-lg border-white border flex flex-col grow h-96">
        <LobbyHeader game={game} />
        {game && (
          <div>
            <LobbyReadyToStartText isGameReadyToStart={isGameReadyToStart} />
            <LobbyPlayerList game={game} />
          </div>
        )}
      </div>
      <div className="text-white flex flex-col justify-between">
        <LobbyGameCode gameCode={gameCode} />
        <LobbyStartGameButton
          handleStartGame={handleStartGame}
          isGameReadyToStart={isGameReadyToStart}
        />
      </div>
    </div>
  );
}
