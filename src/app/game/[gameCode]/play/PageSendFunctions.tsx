import {Player} from "@/app/types";

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
        stompClient.send(`/app/game/startSabotage`, {}, JSON.stringify(sabotageMessage));
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
        stompClient.send(`/app/game/report`, {}, JSON.stringify(reportMessage));
    }
}

type KillPlayerProps ={
    stompClient: any,
    gameCode: string,
    playerToKillId: number,
}
export function sendKillPlayerMessage({stompClient, gameCode, playerToKillId}: KillPlayerProps) {
    const killMessage = {
        gameCode: gameCode,
        playerToKillId: playerToKillId,
    };
    if (stompClient) {
        stompClient.send(`/app/game/kill`, {}, JSON.stringify(killMessage));
    }
}

type MovePlayerProps = {
    stompClient: any,
    playerId: string | null,
    keyCodeToSend: string,
    gameCode: string,
    newMirroring: boolean,
    players: Player[],
}
export function sendMovePlayerMessage({stompClient, playerId, keyCodeToSend, gameCode, newMirroring, players}: MovePlayerProps){
    const moveMessage = {
        id: playerId,
        keyCode: keyCodeToSend,
        gameCode: gameCode,
        Mirrored: newMirroring,
        isMoving: true,
    };

    if (stompClient && (players?.length ?? 0) > 0 && playerId) {
        stompClient.send("/app/move", {}, JSON.stringify(moveMessage));
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
    stompClient.send("/app/game/end", {}, JSON.stringify(endGameMessage));
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