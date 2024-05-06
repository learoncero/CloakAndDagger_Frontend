import React, { useEffect, useState } from "react";
import { Chat as ChatType, Player } from "@/app/types";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import ChatBubble from "./ChatBubble";
import { startChat } from "./actions";
import ChatMessageInputField from "./ChatMessageInputField";
import ChatSendButton from "./ChatSendButton";

type Props = {
  onClose: () => void;
  gameCode: string;
  currentPlayer: Player;
};

export default function Chat({ onClose, gameCode, currentPlayer }: Props) {
  const [stompClient, setStompClient] = useState<any>(null);
  const [chat, setChat] = useState<ChatType>({} as ChatType);
  const [message, setMessage] = useState("");
  const [remainingTime, setRemainingTime] = useState<number>(60);

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

    handleStartChat();
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
      onClose();
    }
  }, [remainingTime, onClose]);

  async function handleStartChat() {
    const response = await startChat(gameCode as string);
    if (response.status === 200) {
      setChat(response.data as ChatType);
    }
  }

  function updateMessage(message: string) {
    setMessage(message);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
      <div className="max-w-3xl w-full px-10 text-white border border-white rounded-lg relative min-h-96">
        <h2 className="text-3xl font-bold mb-4 text-white border-b pt-10 pb-5">
          Chat - Remaining Time: {remainingTime} seconds
        </h2>
        <div className="h-96 rounded-lg overflow-y-auto pb-5 scrollbar-hide scroll-auto">
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
          />
          <ChatSendButton onMessageSend={onMessageSend} />
        </div>
      </div>
    </div>
  );
}
