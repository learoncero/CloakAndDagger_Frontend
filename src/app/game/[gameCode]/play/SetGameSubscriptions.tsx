import toast from "react-hot-toast";
import {Sabotage} from "@/app/types";

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
      `/topic/${gameCode}/duelChoiceResult`,
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

        const activeSabotage = receivedMessage.body.sabotages.find((sabotage: any) => sabotage.position.x !== -1 && sabotage.position.y !== -1);

        if (activeSabotage) {
          setImpostorWinTimer(3000000000000000000);
          toast(
              `Sabotage initiated: ${activeSabotage.title}. ${activeSabotage.description}. Crewmates, time is running out! You have 30 seconds to act!`,
              {
                position: "top-center",
                duration: 10000, // Duration in milliseconds
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
      [`/topic/${gameCode}/duelChoiceResult`]: (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        updateGame(receivedMessage.body);


        let result;
        const sabotage = receivedMessage.body.sabotages.find((sabotage: Sabotage) => sabotage.id === 4);


        const wallPositions = sabotage?.wallPositions?.flat();


        if (wallPositions) {
          const allWallsDefeated = wallPositions.every((pos: { x: number; y: number }) => pos.x === -1 && pos.y === -1);


          if (allWallsDefeated) {
            result = "Congratulations, you won the duel! The opponent has been defeated.";
          } else {
            result = "You lost the duel! The opponent has bested you this time.";
          }
        } else {
          result = "You lost the duel! The opponent has bested you this time.";
        }

        toast(result, {
          position: "bottom-right",
          style: {
            border: "2px solid black",
            padding: "16px",
            color: "black",
            backgroundColor: "#eF4444",
          },
          icon: "✂️",
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
