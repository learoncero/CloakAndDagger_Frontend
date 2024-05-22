import toast from "react-hot-toast";

interface Handlers {
  [key: string]: (message: { body: string }) => void;
}
let subscriptionsSet = false;

export function SetGameSubscriptions(
    stompClient: any,
    updateGame: Function,
    setImpostorWinTimer: Function,
    handleChatView: Function,
    setLatestVote: Function,
    setShowBodyReported: Function
) {
  if (!subscriptionsSet) {
    const subscriptions = [
      "/topic/positionChange",
      "/topic/IdleChange",
      "/topic/playerKill",
      "/topic/bodyReport",
      "/topic/gameEnd",
      "/topic/sabotageStart",
      "/topic/sabotageCancel",
      "/topic/voteResults",
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
        setShowBodyReported(true);
        setTimeout(() => {
          handleChatView(true);
        }, 2000);
      },
      "/topic/gameEnd": (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);
      },
      "/topic/sabotageStart": (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);

        const activeSabotage = receivedMessage.body.sabotages.find((sabotage: any) => sabotage.position.x !== -1 && sabotage.position.y !== -1);

        if (activeSabotage) {
          setImpostorWinTimer(30);
          toast(
              `Sabotage initiated: ${activeSabotage.title}. ${activeSabotage.description}. Crewmates, time is running out! You have 30 seconds to act!`,
              {
                position: "top-center",
                duration: 5000,
                style: {
                  border: "2px solid black",
                  padding: "16px",
                  color: "white",
                  backgroundColor: "#eF4444",
                },
                icon: "❕",
              }
          );
        } else {
          console.error("Active sabotage data missing in message: ", receivedMessage);
        }
      },
      "/topic/sabotageCancel": (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);

        const activeSabotage = receivedMessage.body.sabotages.find((sabotage: any) => sabotage.position.x !== -1 && sabotage.position.y !== -1);

        if (activeSabotage) {
          setImpostorWinTimer(-1);
          toast(
              `Sabotage cancelled. Crewmates, you're safe for now!`,
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
        } else {
          console.error("Active sabotage data missing in message: ", receivedMessage);
        }
      },
      "/topic/voteResults": (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage);
        setLatestVote(receivedMessage.votingResults.at(-1));
      },
    };

    subscriptions.forEach((topic) => {
      stompClient.subscribe(topic, (message: { body: string }) => {
        handlers[topic](message);
      });
    });
    subscriptionsSet = true;
  }
}
