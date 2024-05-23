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
    gameCode: string,
    setShowBodyReported: Function,
) {
  if (!subscriptionsSet) {
    const subscriptions = [
      `/topic/${gameCode}/positionChange`,
      `/topic/${gameCode}/IdleChange`,
      `/topic/${gameCode}/playerKill`,
      `/topic/${gameCode}/bodyReport`,
      `/topic/${gameCode}/gameEnd`,
      `/topic/${gameCode}/sabotageStart`,
      `/topic/${gameCode}/sabotageCancel`,
      `/topic/${gameCode}/voteResults`,
    ];

    const handlers: Handlers = {
      [`/topic/${gameCode}/positionChange`]: (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);
      },
      [`/topic/${gameCode}/IdleChange`]: (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);
      },
      [`/topic/${gameCode}/playerKill`]: (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);
      },
      [`/topic/${gameCode}/bodyReport`]: (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("receivedMessage BodyReport: ", receivedMessage);
        updateGame(receivedMessage.body);
        setShowBodyReported(true);
        setTimeout(() => {
          handleChatView(true);
        }, 2000);
      },
      [`/topic/${gameCode}/gameEnd`]: (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);
      },
      [`/topic/${gameCode}/sabotageStart`]: (message: { body: string }) => {
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

      },
      [`/topic/${gameCode}/sabotageCancel`]: (message: { body: string }) => {
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
      },
      [`/topic/${gameCode}/voteResults`]: (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage);
        setLatestVote(receivedMessage.votingResult);
      }
    };

    subscriptions.forEach((topic) => {
      stompClient.subscribe(topic, (message: { body: string }) => {
        handlers[topic](message);
      });
    });

    subscriptionsSet = true;
  }
}
