import { useState, useEffect } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

export default function useWebSocket(url: string) {
  const [stompClient, setStompClient] = useState<any>(null);

  useEffect(() => {
    const socket = new SockJS(url);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      setStompClient(client);
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [url]);

  return stompClient;
}
