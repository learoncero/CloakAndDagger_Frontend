"use client";

import { useEffect, useRef, useState } from "react";
import { GameStatus, Player, Role } from "@/app/types";
import useGame from "@/hooks/useGame";
import { SetGameSubscriptions } from "./SetGameSubscriptions";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal";
import BackLink from "@/components/BackLink";
import Chat from "./Chat";
import { AnimationProvider } from "@/app/AnimationContext";
import useWebSocket from "@/hooks/useWebSocket";
import GameView from "./GameView";
import { Toaster } from "react-hot-toast";
import {
  sendCancelSabotageMessage,
  sendGameEndMessage,
  sendKillPlayerMessage,
  sendMovePlayerMessage,
  sendReportBodyMessage,
  sendSabotageMessage,
} from "./PageSendFunctions";
import TaskService from "@/services/TaskService";
import {Console} from "inspector";

export default function PlayGame() {
  console.log("PAGE RENDERED");
  const { gameCode } = useParams<{ gameCode: string }>();
  const stompClient = useWebSocket("http://localhost:5010/ws");
  const { game, map, loadGameData, updateGame } = useGame(gameCode as string);
  const [showChat, setShowChat] = useState(false);
  const [impostorWinTimer, setImpostorWinTimer] = useState(-1);
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const pressedKeys = useRef<Set<string>>(new Set());
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  let playerId: string | null;
  if (typeof window !== "undefined") {
    playerId = sessionStorage.getItem("playerId");
  }

  const currentPlayer = game?.players?.find(
    (player) => player.id.toString() === playerId
  );

  const isGhost =
    currentPlayer?.role === Role.CREWMATE_GHOST ||
    currentPlayer?.role === Role.IMPOSTOR_GHOST;

  const playerRole = currentPlayer?.role ?? "";

  const isMovingAllowed =
    playerRole !== Role.CREWMATE_GHOST &&
    playerRole !== Role.IMPOSTOR_GHOST &&
    game?.gameStatus === GameStatus.IN_GAME &&
    !showChat &&
    !showTaskPopup;

  useEffect(() => {
    if (stompClient) {
      SetGameSubscriptions(
        stompClient,
        updateGame,
        setImpostorWinTimer,
        handleChatView,
          gameCode
      );
    }
    return () => {
      if (stompClient) {
        stompClient.unsubscribe();
      }
    };
  }, [stompClient]);

  useEffect(() => {
    loadGameData().then();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [stompClient, game?.players, showTaskPopup, handleChatView]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (impostorWinTimer > 0) {
      countdownInterval = setInterval(() => {
        setImpostorWinTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (impostorWinTimer === 0) {
      sendGameEndMessage({ stompClient, gameCode });
    }
    return () => clearInterval(countdownInterval);
  }, [impostorWinTimer]);

  function handleKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;
    const validKeyCodes = ["KeyA", "KeyW", "KeyD", "KeyS"];
    if (playerId && validKeyCodes.includes(keyCode) && isMovingAllowed) {
      if (!pressedKeys.current.has(keyCode)) {
        pressedKeys.current.add(keyCode);
        sendMoveMessage().then();
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
  function handleChatView(value: boolean) {
    setShowChat(value);
  }

  async function handleTaskCompleted(taskId: number) {
    let task = game.tasks.find((task) => task.taskId === taskId);
    const isCompleted = await TaskService.getCompletedStatus(
      taskId,
      game.gameCode
    );

    if (isCompleted.data === true && task) {
      task.completed = true;
    }

    setShowTaskPopup(false);
  }

  async function sendMoveMessage() {
    const keysArray = Array.from(pressedKeys.current.values());
    const keyCodeToSend = keysArray.length > 0 ? keysArray[0] : null;
    let newMirroring =
      keyCodeToSend === "KeyA"
        ? true
        : keyCodeToSend === "KeyD"
        ? false
        : false;

    if (!keyCodeToSend) return;
    sendMovePlayerMessage({
      stompClient,
      playerId,
      keyCodeToSend,
      gameCode,
      newMirroring,
      players: game.players,
    });
  }

  async function killPlayer(
    gameCode: string,
    playerToKillId: number,
    nearbyTask: number
  ) {
    sendKillPlayerMessage({
      stompClient,
      gameCode,
      playerToKillId,
      nearbyTask,
    });
  }

  async function reportBody(gameCode: string, bodyToReportId: number) {
    sendReportBodyMessage({ stompClient, gameCode, bodyToReportId });
  }

  async function getSabotagePosition(sabotageId: number) {
    sendSabotageMessage({ stompClient, gameCode, sabotageId, map: game.map });
  }

  function handleCancelSabotage() {
    sendCancelSabotageMessage({ stompClient, impostorWinTimer, gameCode });
  }

  return (
    <AnimationProvider>
      <div className="min-h-screen min-w-screen bg-black text-white">
        {showChat && (
          <Chat
            onClose={handleChatView}
            gameCode={gameCode}
            currentPlayer={currentPlayer as Player}
          />
        )}
        {isGhost ? (
          <Modal modalText={"GAME OVER!"}>
            <BackLink href={"/game/setup"}>Return to Landing Page</BackLink>
          </Modal>
        ) : game?.gameStatus === GameStatus.CREWMATES_WIN ? (
          <Modal modalText={"CREWMATES WIN!"}>
            <BackLink href={"/game/setup"}>Return to Landing Page</BackLink>
          </Modal>
        ) : game?.gameStatus === GameStatus.IMPOSTORS_WIN ? (
          <Modal modalText={"IMPOSTORS WIN!"}>
            <BackLink href={"/game/setup"}>Return to Landing Page</BackLink>
          </Modal>
        ) : currentPlayer ? (
          <GameView
            game={game}
            map={map.map}
            currentPlayer={currentPlayer}
            showTaskPopup={showTaskPopup}
            getSabotagePosition={getSabotagePosition}
            handleCancelSabotage={handleCancelSabotage}
            killPlayer={killPlayer}
            reportBody={reportBody}
            handleTaskCompleted={handleTaskCompleted}
            handleShowTaskPopup={setShowTaskPopup}
          />
        ) : (
          <div>No Player Data Found</div>
        )}
      </div>
      <Toaster />
    </AnimationProvider>
  );
}
