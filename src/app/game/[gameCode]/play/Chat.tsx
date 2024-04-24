import React, { useEffect, useState } from "react";
import { startChat } from "./actions";
import { Player } from "@/app/types";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

type Props = {
  onClose: () => void;
  gameCode: string;
  players: Player[];
};

export default function Chat({ onClose, gameCode, players }: Props) {
  const [stompClient, setStompClient] = useState<any>(null);

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div className="max-w-lg w-full p-10 text-white border border-white rounded-lg relative">
        <button
          className="absolute top-0 right-0 text-white text-lg p-2"
          onClick={onClose}
        >
          Close
        </button>
        <h2 className="text-3xl font-bold mb-4 text-white">
          Chat with {activePlayers.length} players
        </h2>
        <h3 className="text-xl font-bold mb-2">Participants</h3>
        <ul className="space-y-2 text-white">
          {activePlayers.map((player) => (
            <li key={player.id}>Username: {player.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
