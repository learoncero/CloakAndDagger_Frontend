import {Player, Task} from "@/app/types";
import {Console} from "inspector";

type SabotageProps = {
    stompClient: any,
    gameCode: string,
    sabotageId: number,
    map: string,
}
export function  sendSabotageMessage({stompClient, gameCode, sabotageId, map}: SabotageProps) {
    const sabotageMessage = {
        gameCode: gameCode,
        sabotageId: sabotageId,
        map: map,
    };
    if (stompClient) {
        stompClient.send(`/app/game/${gameCode}/startSabotage`, {}, JSON.stringify(sabotageMessage));
    }
}

type ReportBodyProps = {
    stompClient: any,
    gameCode: string,
    bodyToReportId: number,
}
export function sendReportBodyMessage({stompClient, gameCode, bodyToReportId}: ReportBodyProps){
    const reportMessage = {
        gameCode: gameCode,
        bodyToReportId: bodyToReportId,
    };
    if (stompClient) {
        stompClient.send(`/app/game/${gameCode}/report`, {}, JSON.stringify(reportMessage));
    }
}

type KillPlayerProps ={
    stompClient: any,
    gameCode: string,
    playerToKillId: number,
    nearbyTask: number,
}
export function sendKillPlayerMessage({stompClient, gameCode, playerToKillId, nearbyTask}: KillPlayerProps) {
    const killMessage = {
        gameCode: gameCode,
        playerToKillId: playerToKillId,
        nearbyTask: nearbyTask,
    };
    if (stompClient) {
        stompClient.send(`/app/game/${gameCode}/kill`, {}, JSON.stringify(killMessage));
    }
}

type MovePlayerProps = {
    stompClient: any;
    playerId: string | null;
    keyCodeToSend: string;
    gameCode: string;
    newMirroring: boolean;
    players: Player[];
};
export function sendMovePlayerMessage({ stompClient, playerId, keyCodeToSend, gameCode, newMirroring, players }: MovePlayerProps) {
    const moveMessage = {
        id: playerId,
        keyCode: keyCodeToSend,
        gameCode: gameCode,
        Mirrored: newMirroring,
        isMoving: true,
    };

    if (stompClient && (players?.length ?? 0) > 0 && playerId) {
        stompClient.send(`/app/${gameCode}/move`, {}, JSON.stringify(moveMessage));
    }
}

type GameEndProps = {
    stompClient: any,
    gameCode: string,
}
export function sendGameEndMessage({stompClient, gameCode}: GameEndProps) {
    const endGameMessage = {
        gameCode: gameCode,
    };
    stompClient.send(`/app/game/${gameCode}/end`, {}, JSON.stringify(endGameMessage));
}

type SabotageCancelProps = {
    stompClient: any,
    impostorWinTimer: number,
    gameCode: string,
}
export function sendCancelSabotageMessage({stompClient, impostorWinTimer, gameCode}: SabotageCancelProps){
    if (impostorWinTimer > 0) {
        stompClient.send(
            `/app/game/${gameCode}/cancelSabotage`,
            {},
            JSON.stringify({})
        );
    }
}

type DuelChoiceProps = {
    stompClient: any,
    gameCode: string,
    choice: string,
};

export function sendDuelChoiceMessage({ stompClient, gameCode, choice }: DuelChoiceProps) {
    const duelChoiceMessage = {
        gameCode: gameCode,
        choice: choice,
    };
    if (stompClient) {
        stompClient.send(`/app/game/${gameCode}/submitDuelChoice`, {}, JSON.stringify(duelChoiceMessage));
    }
}