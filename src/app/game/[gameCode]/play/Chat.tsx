import React, { useEffect, useState } from "react";
import { startChat } from "./actions";
import { Player } from "@/app/types";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import ChatCloseButton from "./ChatCloseButton";
import ChatMessageInputField from "./ChatMessageInputField";
import ChatSendButton from "./ChatSendButton";
import ChatBubble from "./ChatBubble";

type Props = {
  onClose: () => void;
  gameCode: string;
  players: Player[];
};

export default function Chat({ onClose, gameCode, players }: Props) {
  const [stompClient, setStompClient] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const activePlayers = players.filter(
    (player) =>
      player.role !== "CREWMATE_GHOST" && player.role !== "IMPOSTOR_GHOST"
  );

  async function handleStartChat() {
    const chatResult = await startChat(gameCode as string);
    console.log(chatResult.data?.id);
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

    handleStartChat();
  }, [stompClient]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
      <div className="max-w-3xl w-full px-10 text-white border border-white rounded-lg relative min-h-96">
        <ChatCloseButton onClose={onClose} />
        <h2 className="text-3xl font-bold mb-4 text-white border-b pt-10 pb-5">
          Chat with {activePlayers.length} players
        </h2>
        <div className="h-96 rounded-lg overflow-y-auto pb-5">
          <ChatBubble
            message={
              "That's awesome. I think our users will really appreciate the improvements."
            }
            sender={"other player"}
          />
          <ChatBubble
            message={
              "That's awesome. I think our users will really appreciate the improvements."
            }
            sender={"me"}
          />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-white gap-5">
          <ChatMessageInputField />
          <ChatSendButton />
        </div>
      </div>
    </div>
  );
}
