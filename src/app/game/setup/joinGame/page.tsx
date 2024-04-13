"use client";

import BackLink from "@/components/BackLink";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import JoinGameForm from "./JoinGameForm";

export default function JoinGame() {
  const [stompClient, setStompClient] = useState<any>(null);

  useEffect(() => {
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
  }, []);

  // Handle the response to get the player ID from the header
  const handleJoinGameResponse = (message: any) => {
    const data = JSON.parse(message.body);
    const playerId = data.headers.playerId[0];
    if (playerId) {
      // Store player ID in a cookie
      document.cookie = `playerId=${playerId}; path=/`;
    }
  };

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe("/topic/playerJoined", (message: any) => {
        handleJoinGameResponse(message);
      });
    }
  }, [stompClient]);

  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="max-w-md text-white p-8 rounded-lg border-white border">
        <BackLink href={"/game/setup"}>Back</BackLink>
        <JoinGameForm stompClient={stompClient} />
      </div>
    </div>
  );
}
