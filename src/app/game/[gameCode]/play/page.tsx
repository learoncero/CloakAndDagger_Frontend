"use client";

import {useEffect, useRef, useState} from "react";
import {GameStatus, Role} from "@/app/types";
import useGame from "@/hooks/useGame";
//import useGameSubscriptions from "@/hooks/useGameSubscriptions"
import {useParams} from "next/navigation";
import Modal from "@/components/Modal";
import BackLink from "@/components/BackLink";
import Chat from "./Chat";
import {AnimationProvider} from "@/app/AnimationContext";
import useWebSocket from "@/hooks/useWebSocket";
import GameView from "@/app/game/[gameCode]/play/GameView";
import toast, { Toaster } from "react-hot-toast";

export default function PlayGame() {
  console.log("PAGE RENDERED");
  const { gameCode } = useParams();
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

  const playerRole = currentPlayer?.role ?? "";

  //useGameSubscriptions(stompClient, updateGame);

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
          "/topic/sabotageStart",
          (message: { body: string }) => {
            const receivedMessage = JSON.parse(message.body);
            updateGame(receivedMessage.body);
            setImpostorWinTimer(30);
            toast(
                "Sabotage initiated. Crewmates, time is running out! You have 30 seconds to act!",
                {
                  position: "top-center",
                  style: {
                    border: "2px solid black",
                    padding: "16px",
                    color: "white",
                    backgroundColor: "#eF4444",
                  },
                  icon: "❕",
                }
            );
          }
      );

      stompClient.subscribe(
          "/topic/sabotageCancel",
          (message: { body: string }) => {
            const receivedMessage = JSON.parse(message.body);
            updateGame(receivedMessage.body);
            setImpostorWinTimer(-1);
            toast("Sabotage cancelled. Crewmates, you're safe for now!", {
              position: "top-center",
              style: {
                border: "2px solid black",
                padding: "16px",
                color: "white",
                backgroundColor: "#eF4444",
              },
              icon: "❕",
            });
          }
      );

      stompClient.subscribe("/topic/gameEnd", (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);
      });
    }

    return () => {
      // Unsubscribe from WebSocket events when the component unmounts
      if (stompClient) {
        stompClient.disconnect(); // Disconnect from WebSocket
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
  }, [stompClient, game?.players, handleChatClose]);



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
  function handleChatClose() {
    setShowChat(false);
  }

  //todo needs to be sent to backend
  function handleTaskCompleted(taskId: number) {
    let task = game.tasks.find((task) => task.taskId === taskId);
    if (task) {
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

    const moveMessage = {
      id: playerId,
      keyCode: keyCodeToSend,
      gameCode: gameCode,
      Mirrored: newMirroring,
      isMoving: true,
    };

    if (stompClient && (game?.players?.length ?? 0) > 0 && playerId) {
      stompClient.send("/app/move", {}, JSON.stringify(moveMessage));
    }
  }

  async function killPlayer(gameCode: string, playerToKillId: number, nearbyTask: number) {
    const killMessage = {
      gameCode: gameCode,
      playerToKillId: playerToKillId,
      nearbyTask: nearbyTask,
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

  async function getSabotagePosition(sabotageId: number) {
    const sabotageMessage = {
      gameCode: gameCode,
      sabotageId: sabotageId,
      map: game.map,
    };
    if (stompClient) {
      stompClient.send(`/app/game/startSabotage`, {}, JSON.stringify(sabotageMessage));
    }
  }

  function handleCancelSabotage() {
    if (impostorWinTimer > 0) {
      stompClient.send(
          `/app/game/${game.gameCode}/cancelSabotage`,
          {},
          JSON.stringify({})
      );
    }
  }

  console.log("impostorWinTimer", impostorWinTimer);

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
        {currentPlayer?.role === Role.CREWMATE_GHOST ||
         currentPlayer?.role === Role.IMPOSTOR_GHOST
        ?
        <Modal modalText={"GAME OVER!"}>
          <BackLink href={"/"}>Return to Landing Page</BackLink>
        </Modal>
        :
        game?.gameStatus === GameStatus.CREWMATES_WIN
        ?
        <Modal modalText={"CREWMATES WIN!"}>
          <BackLink href={"/"}>Return to Landing Page</BackLink>
        </Modal>
        :
        game?.gameStatus === GameStatus.IMPOSTORS_WIN
        ?
        <Modal modalText={"IMPOSTORS WIN!"}>
          <BackLink href={"/"}>Return to Landing Page</BackLink>
        </Modal>
        :
        currentPlayer
        ?
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
        :
        <div>No Player Data Found</div>}
      </div>
      <Toaster />
    </AnimationProvider>
  );
}
