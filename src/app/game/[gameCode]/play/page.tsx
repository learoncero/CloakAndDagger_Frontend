"use client";

import Stomp from "stompjs";
import {useEffect, useRef, useState} from "react";
import SockJS from "sockjs-client";
import { Game, GameStatus, Player, Role, Map } from "@/app/types";
import ImpostorView from "./ImpostorView";
import CrewmateView from "./CrewmateView";
import useGame from "@/state/useGame";
import { useParams } from "next/navigation";
import { fetchGame, fetchMap } from "./actions";
import Modal from "@/components/Modal";
import BackLink from "@/components/BackLink";
import Chat from "./Chat";
import { AnimationProvider } from "@/app/AnimationContext";

export default function PlayGame() {
  const { gameCode } = useParams();
  const [stompClient, setStompClient] = useState<any>(null);
  const { game, updateGame } = useGame();
  const [map, setMap] = useState<Map>({} as Map);
  const [showChat, setShowChat] = useState(false);
  const [mirroring, setMirroring] = useState(false);
  const pressedKeys = useRef<Set<string>>(new Set());
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  let playerId: string | null;
  if (typeof window !== "undefined") {
    playerId = sessionStorage.getItem("playerId");
  }

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
    if (mapResult && mapResult.status === 200) {
      setMap(mapResult.data as Map);
    } else if (mapResult && mapResult.status === 404) {
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
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [stompClient, game?.players, handleChatClose]);

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
        "/topic/IdleChange",
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

      stompClient.subscribe(
        "/topic/bodyReport",
        (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          updateGame(receivedMessage.body);
          setShowChat(true);
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
      game?.gameStatus === GameStatus.IN_GAME &&
      !showChat
    ) {
      if (!pressedKeys.current.has(keyCode)) {
        pressedKeys.current.add(keyCode);
          sendMoveMessage();
        if (!intervalId.current) {
          intervalId.current = setInterval(sendMoveMessage, 175);
        }
      }
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    const keyCode = event.code;
    const validKeyCodes = ["KeyA", "KeyW", "KeyD", "KeyS"];
    if (validKeyCodes.includes(keyCode)) {
      pressedKeys.current.delete(keyCode);
      if (pressedKeys.current.size === 0 && intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    }
  }

  function sendMoveMessage() {
    const keysArray = Array.from(pressedKeys.current.values());
    const keyCodeToSend = keysArray.length > 0 ? keysArray[0] : null;
      let newMirroring = (keyCodeToSend === "KeyA") ? true :
          (keyCodeToSend === "KeyD") ? false : mirroring;

    if (!keyCodeToSend) return;

    const moveMessage = {
      id: playerId,
      keyCode: keyCodeToSend,
      gameCode: game?.gameCode,
      Mirrored: newMirroring,
      isMoving: true,
    };

    if (stompClient && (game?.players?.length ?? 0) > 0 && playerId) {
      stompClient.send("/app/move", {}, JSON.stringify(moveMessage));
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

  async function reportBody(gameCode: string, bodyToReportId: number) {
    const reportMessage = {
      gameCode: gameCode,
      bodyToReportId: bodyToReportId,
    };
    if (stompClient) {
      stompClient.send(`/app/game/report`, {}, JSON.stringify(reportMessage));
    }
  }

  function handleChatClose() {
    setShowChat(false);
  }

  return (
    <AnimationProvider>
      <div className="min-h-screen min-w-screen bg-black text-white">
        {showChat && (
          <Chat
            onClose={handleChatClose}
            gameCode={gameCode as string}
            players={game.players}
          />
        )}
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
            ) : playerRole === Role.CREWMATE_GHOST ||
              playerRole === Role.IMPOSTOR_GHOST ? (
              <Modal modalText={"GAME OVER!"}>
                <BackLink href={"/"}>Return to Landing Page</BackLink>
              </Modal>
            ) : (
              <CrewmateView
                map={map.map}
                playerList={game?.players as Player[]}
                currentPlayer={currentPlayer}
                game={game}
                reportBody={reportBody}
              />
            )}
          </div>
        ) : (
          <div>No Player Data Found</div>
        )}
      </div>
    </AnimationProvider>
  );
}
