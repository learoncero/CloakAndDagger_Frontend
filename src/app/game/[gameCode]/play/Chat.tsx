import React, { useEffect, useRef, useState } from "react";
import {Chat as ChatType, Player, VoteEvent} from "@/app/types";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import ChatBubble from "./ChatBubble";
import { endChat } from "./actions";
import ChatMessageInputField from "./ChatMessageInputField";
import ChatSendButton from "./ChatSendButton";
import Voting from "./Voting";

type Props = {
  onClose: (value: boolean) => void;
  gameCode: string;
  players: Player[];
  currentPlayer: Player;
  setShowVotingResults: (value: boolean) => void;
};

export default function Chat({
  onClose,
  gameCode,
  currentPlayer,
  players,
  setShowVotingResults,
}: Props) {
  const [stompClient, setStompClient] = useState<any>(null);
  const [chat, setChat] = useState<ChatType>({} as ChatType);
  const [message, setMessage] = useState("");
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [playerVotes, setPlayerVotes] = useState<VoteEvent[]>([]);
  const activePlayers = players
    ? players.filter(
        (player) => player.role === "IMPOSTOR" || player.role === "CREWMATE"
      )
    : [];

  useEffect(() => {
    if (!stompClient) {
      const socket = new SockJS("http://localhost:5011/ws");
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
  }, []);

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe(
        "/topic/messages",
        (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          setChat(receivedMessage.body);
        },
        (error: any) => {
          console.error("Error subscribing to /topic/messages:", error);
        }
      );
      stompClient.subscribe("/topic/vote", (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        const bodyMessage = receivedMessage.body;
        const voteEventsFromMessage = bodyMessage.voteEvents;

        if (voteEventsFromMessage && voteEventsFromMessage.length > 0) {
          const allVoteEvents = voteEventsFromMessage.map((event: VoteEvent) => ({
            votedForPlayer: event.votedForPlayer,
            votedBy: event.votedBy
          }));
        setPlayerVotes(allVoteEvents);
        }
      });
      return () => {
        if (stompClient) {
          stompClient.unsubscribe();
        }
      }
    }
  }, [stompClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      onClose(false);
      setShowVotingResults(true); //todo test this
      handleEndChat();
    }
  }, [remainingTime, onClose]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  async function handleEndChat() {
    await endChat(gameCode as string);
  }

  function updateMessage(message: string) {
    setMessage(message);
  }

  async function handleVotes(playerId: number) {
    const votingMessage = {
      gameCode: gameCode,
      voteEvent: {
        votedForPlayer: playerId,
        votedBy: currentPlayer.id,
      },
    };
    if (stompClient) {
      stompClient.send("/app/chat/vote", {}, JSON.stringify(votingMessage));
    }
  }

  async function onMessageSend() {
    const chatMessage = {
      gameCode: gameCode,
      message: message,
      sender: currentPlayer.username,
    };
    if (stompClient && message.trim() !== "") {
      stompClient.send(
        "/app/chat/sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
    }
    setMessage("");
  }

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
        <div className="max-w-3xl w-full px-10 text-white border border-white rounded-lg relative min-h-96">
          <h2 className="text-3xl font-bold mb-4 text-white border-b pt-10 pb-5">
            Chat - Remaining Time: {remainingTime} seconds
          </h2>
          <div
            ref={chatContainerRef}
            className="h-96 rounded-lg overflow-y-scroll pb-5 scrollbar-hide scroll-smooth"
          >
            {chat?.chatMessages?.map((chatMessage, index) => (
              <ChatBubble
                key={index}
                message={chatMessage.message}
                sender={chatMessage.sender}
                currentPlayerName={currentPlayer.username}
              />
            ))}
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-white gap-5">
            <ChatMessageInputField
              updateMessage={updateMessage}
              message={message}
              onMessageSend={onMessageSend}
            />
            <ChatSendButton onMessageSend={onMessageSend} />
          </div>
        </div>
        <Voting
          currentPlayer={currentPlayer}
          activePlayers={activePlayers}
          handleVotes={handleVotes}
        />
      </div>
    </div>
  );
}
