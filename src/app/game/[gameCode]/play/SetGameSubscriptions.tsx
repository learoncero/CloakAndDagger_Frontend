import toast from "react-hot-toast";

interface Handlers {
  [key: string]: (message: { body: string }) => void;
}
let subscriptionsSet = false;


export function SetGameSubscriptions (stompClient: any, updateGame: Function, setImpostorWinTimer: Function, handleChatView: Function, setLatestVote: Function, gameCode: string)  {
  if (!subscriptionsSet) {

    const subscriptions = [
      `/topic/${gameCode}/positionChange`,
      `/topic/${gameCode}/IdleChange`,
      "/topic/playerKill",
      "/topic/bodyReport",
      "/topic/gameEnd",
      "/topic/sabotageStart",
      "/topic/sabotageCancel",
      "/topic/voteResults",
    ];

    const handlers: Handlers = {
      [`/topic/${gameCode}/positionChange`]: (message: { body: string }) => {
        console.log('Received positionChange message:', message);
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);
        console.log('Received positionChange message:', message);
      },
      [`/topic/${gameCode}/IdleChange`]: (message: { body: string }) => {
        console.log('Received IdleChange message:', message);
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
        handleChatView(true);
      },
      "/topic/gameEnd": (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);
      },
      "/topic/sabotageStart": (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);
        setImpostorWinTimer(30);
        toast("Sabotage initiated. Crewmates, time is running out! You have 30 seconds to act!",{
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
      "/topic/sabotageCancel": (message: { body: string }) => {
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
      "/topic/voteResults": (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage);
        setLatestVote(receivedMessage.votingResults.at(-1));
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
