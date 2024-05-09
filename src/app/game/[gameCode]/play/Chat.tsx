import React, { useEffect, useRef, useState } from "react";
import { Chat as ChatType, Player } from "@/app/types";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import ChatBubble from "./ChatBubble";
import { endChat } from "./actions";
import ChatMessageInputField from "./ChatMessageInputField";
import ChatSendButton from "./ChatSendButton";
import Voting from "./Voting";
import VotingResultsPopup from "./VotingResultsPopup";

type Props = {
  onClose: (value: boolean) => void;
  gameCode: string;
  currentPlayer: Player;
  activePlayers: Player[];
};

export default function Chat({ onClose, gameCode, currentPlayer, activePlayers }: Props) {
  const [stompClient, setStompClient] = useState<any>(null);
  const [chat, setChat] = useState<ChatType>({} as ChatType);
  const [message, setMessage] = useState("");
  const [remainingTime, setRemainingTime] = useState<number>(300000);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showVotingResults, setShowVotingResults] = useState(false);
  const [votedPlayer, setVotedPlayer] = useState<Player | undefined>(undefined);

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
  }, [stompClient]);

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
    }
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
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
    setShowVotingResults(true); //todo test this
    await endChat(gameCode as string);
  }

  function updateMessage(message: string) {
    setMessage(message);
  }

  function handleVoting(playerId : number) {
    setVotedPlayer(activePlayers.find(player => player.id === playerId));
    setShowVotingResults(true)
  }

    function onCloseResultsPopup() {
        setShowVotingResults(false)
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

  console.log("chat", chat);

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
        {showVotingResults &&
            <VotingResultsPopup onCloseResultsPopup={onCloseResultsPopup} votedPlayer={votedPlayer}/>
        }
        <Voting activePlayers={activePlayers} handleVoting={handleVoting}/>
      </div>
    </div>
  );
}
