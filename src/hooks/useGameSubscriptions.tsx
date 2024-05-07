import {useEffect, useRef} from "react";

interface Handlers {
  [key: string]: (message: { body: string }) => void;
}

const useGameSubscriptions = (stompClient: any, updateGame: Function) => {
  const subscriptionsSet = useRef<boolean>(false);
  useEffect(() => {
    if (stompClient && !subscriptionsSet.current) {
      const subscriptions = [
        "/topic/positionChange",
        "/topic/IdleChange",
        "/topic/playerKill",
        "/topic/bodyReport",
        "/topic/gameEnd",
      ];

      const handlers: Handlers = {
        "/topic/positionChange": (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          updateGame(receivedMessage.body);
        },
        "/topic/IdleChange": (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          updateGame(receivedMessage.body);
        },
        "/topic/playerKill": (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          updateGame(receivedMessage.body);
        },
        "/topic/bodyReport": (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          updateGame(receivedMessage.body);
        },
        "/topic/gameEnd": (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          updateGame(receivedMessage.body);
        },
      };

      subscriptions.forEach((topic) => {
        const subscription = stompClient.subscribe(topic, (message: { body: string }) => {
          handlers[topic](message);
        });
        return () => {
          subscription.unsubscribe();
        };
      });
      subscriptionsSet.current = true;
    }
  }, [stompClient, updateGame]);
};

export default useGameSubscriptions;
