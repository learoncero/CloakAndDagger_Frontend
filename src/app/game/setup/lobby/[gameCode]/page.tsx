"use client";

import useGame from "@/hooks/useGame";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LobbyStartGameButton from "./LobbyStartGameButton";
import LobbyGameCode from "./LobbyGameCode";
import LobbyPlayerList from "./LobbyPlayerList";
import LobbyReadyToStartText from "./LobbyReadyToStartText";
import LobbyHeader from "./LobbyHeader";
import { fetchGame } from "./actions";
import { Game, GameMode, Role } from "@/app/types";
import useWebSocket from "@/hooks/useWebSocket";
import LobbyLeave from "@/app/game/setup/lobby/[gameCode]/LobbyLeave";
import Manual from "@/app/game/[gameCode]/play/Manual";
import ToggleButton from "@/components/ToggleButton";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Lobby() {
  const stompClient = useWebSocket(`${apiUrl}:5010/ws`);
  const router = useRouter();
  const { gameCode } = useParams();
  const { game, updateGame } = useGame(gameCode as string);
  const [showManual, setShowManual] = useState(false);

  let playerId: string | null;
  if (typeof window !== "undefined") {
    playerId = sessionStorage.getItem("playerId");
  }

  const currentPlayer = game?.players?.find(
    (player) => player.id.toString() === playerId
  );

  async function loadGameData() {
    const gameResult = await fetchGame(gameCode as string);
    if (gameResult.status === 200) {
      updateGame(gameResult.data as Game);
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
    loadGameData();
  }, []);

  useEffect(() => {
    if (!stompClient || !gameCode) return;

    stompClient.subscribe("/topic/" + gameCode + "/play", function () {
      router.push("/game/" + gameCode + "/play");
    });
  }, [stompClient]);

  function handleStartGame() {
    if (stompClient && gameCode && game) {
      stompClient.send(`/app/${gameCode}/play`, {}, JSON.stringify(game));
    }
  }

  if (!game) {
    return <div>Loading...</div>;
  }

  const isGameReadyToStart = game?.numberOfPlayers === game?.players?.length;

  function toggleManualVisibility() {
    setShowManual(!showManual);
  }

  return (
    <div className="min-h-screen bg-black flex justify-center pl-5 items-center gap-10">
      <div className="max-w-xl text-white p-8 rounded-lg border-white border flex flex-col grow h-100">
        <LobbyHeader game={game} />
        {game && (
          <div>
            <LobbyReadyToStartText isGameReadyToStart={isGameReadyToStart} />
            <LobbyPlayerList game={game} />
          </div>
        )}
      </div>
      <div className="text-white flex flex-col justify-between">
        <div className="flex flex-col pb-12">
          <ToggleButton onClick={toggleManualVisibility} label="Show Manual" />
          {showManual && <Manual onClose={toggleManualVisibility} />}
        </div>

        {game.gameMode === GameMode.PRIVATE && (
          <LobbyGameCode gameCode={gameCode} />
        )}

        <LobbyStartGameButton
          handleStartGame={handleStartGame}
          isGameReadyToStart={isGameReadyToStart}
        />
        <LobbyLeave
          gameCode={gameCode as string}
          playerUsername={currentPlayer?.username as string}
        />
      </div>
    </div>
  );
}
