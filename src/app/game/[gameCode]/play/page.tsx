"use client";

import { useEffect, useRef, useState } from "react";
import { GameStatus, Role } from "@/app/types";
import ImpostorView from "./ImpostorView";
import CrewmateView from "./CrewmateView";
import useGame from "@/hooks/useGame";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal";
import BackLink from "@/components/BackLink";
import Chat from "./Chat";
import { AnimationProvider } from "@/app/AnimationContext";
import useWebSocket from "@/hooks/useWebSocket";

export default function PlayGame() {
  const { gameCode } = useParams();
  const stompClient = useWebSocket("http://localhost:5010/ws");
  const { game, map, loadGameData, updateGame } = useGame(gameCode as string);
  const [showChat, setShowChat] = useState(false);
  const [mirroring, setMirroring] = useState(false);
  const pressedKeys = useRef<Set<string>>(new Set());
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [impostorWinTimer, setImpostorWinTimer] = useState(-1);
  const [showTaskPopup, setShowTaskPopup] = useState(false);

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

  useEffect(() => {
    loadGameData();
  }, []);

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

      stompClient.subscribe(
          "/topic/sabotage",
            (message: { body: string }) => {
                const receivedMessage = JSON.parse(message.body);
                updateGame(receivedMessage.body);
            }
      )

      stompClient.subscribe(
          "/topic/gameEnd",
          (message: { body: string }) => {
            const receivedMessage = JSON.parse(message.body);
            updateGame(receivedMessage.body);
      });
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
      !showChat &&
      !showTaskPopup
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
    let newMirroring =
      keyCodeToSend === "KeyA"
        ? true
        : keyCodeToSend === "KeyD"
        ? false
        : mirroring;

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

  function getSabotagePosition(sabotageId: number) {
    const sabotageMessage = {
      gameCode: gameCode,
      sabotageId: sabotageId,
      map: game.map,
    };
    if (stompClient) {
      stompClient.send(`/app/game/sabotage`, {}, JSON.stringify(sabotageMessage));
    }
  }

  function handleChatClose() {
    setShowChat(false);
  }

  function handleImpostorWinTimer() {
    setImpostorWinTimer(45);
  }

  function handleShowTaskPopup(show: boolean) {
    setShowTaskPopup(show);
  }

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (impostorWinTimer > 0) {
      countdownInterval = setInterval(() => {
        setImpostorWinTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (impostorWinTimer === 0) {
      const endGameMessage = {
        gameCode: gameCode,
      };
      stompClient.send("/app/game/end", {}, JSON.stringify(endGameMessage));
    }

    return () => clearInterval(countdownInterval);
  }, [impostorWinTimer]);

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
        {game?.gameStatus === GameStatus.IMPOSTORS_WIN &&
        currentPlayer?.role != Role.CREWMATE_GHOST &&
        currentPlayer?.role != Role.IMPOSTOR_GHOST ? (
          <Modal modalText={"IMPOSTORS WIN!"}>
            <BackLink href={"/"}>Return to Landing Page</BackLink>
          </Modal>
        ) : game?.gameStatus === GameStatus.CREWMATES_WIN &&
          currentPlayer?.role != Role.CREWMATE_GHOST &&
          currentPlayer?.role != Role.IMPOSTOR_GHOST ? (
          <Modal modalText={"CREWMATES WIN!"}>
            <BackLink href={"/"}>Return to Landing Page</BackLink>
          </Modal>
        ) : currentPlayer ? (
          <div>
            {playerRole === Role.IMPOSTOR ? (
              <ImpostorView
                map={map.map}
                currentPlayer={currentPlayer}
                game={game}
                killPlayer={killPlayer}
                handleImpostorWinTimer={handleImpostorWinTimer}
                reportBody={reportBody}
                getSabotagePosition={getSabotagePosition}
              />
            ) : playerRole === Role.CREWMATE_GHOST ||
              playerRole === Role.IMPOSTOR_GHOST ? (
              <Modal modalText={"GAME OVER!"}>
                <BackLink href={"/"}>Return to Landing Page</BackLink>
              </Modal>
            ) : (
              <CrewmateView
                map={map.map}
                currentPlayer={currentPlayer}
                game={game}
                reportBody={reportBody}
                showTaskPopup={showTaskPopup}
                handleShowTaskPopup={handleShowTaskPopup}
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
