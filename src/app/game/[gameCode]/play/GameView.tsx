import RoleInformation from "@/app/game/[gameCode]/play/RoleInformation";
import SabotageList from "@/app/game/[gameCode]/play/SabotageList";
import TaskList from "@/app/game/[gameCode]/play/TaskList";
import MapDisplay from "@/app/game/[gameCode]/play/MapDisplay";
import MapButton from "@/app/game/[gameCode]/play/MapButton";
import PlayerList from "@/app/game/[gameCode]/play/PlayerList";
import CrewmateCounter from "@/app/game/[gameCode]/play/CrewmateCounter";
import ActionButton from "@/components/ActionButton";
import MiniMap from "@/app/game/[gameCode]/play/MiniMap";
import toast, {Toaster} from "react-hot-toast";
import TaskGateway from "@/app/game/[gameCode]/play/TaskGateway";
import {Game, Player, Role, Map, Sabotage} from "@/app/types";
import {useCallback, useEffect, useState} from "react";
import useNearbyTasks from "@/hooks/useNearbyTasks";
import useNearbyEntities from "@/hooks/useNearbyEntities";
import MiniGameService from "@/services/MiniGameService";

type Props = {
    game: Game;
    map: string[][]
    currentPlayer: Player;
    getSabotagePosition: (sabotageId: number) => void;
    killPlayer: (gameCode: string, playerId: number) => void;
    reportBody: (gameCode: string, playerId: number) => void;
    handleTaskCompleted: (taskId: number) => void;
    handleImpostorWinTimer: () => void;
    showTaskPopup: boolean;
    handleShowTaskPopup: (show: boolean) => void;
}

export default function GameView ({
    game,
    map,
    currentPlayer,
    getSabotagePosition,
    killPlayer,
    reportBody,
    handleTaskCompleted,
    handleImpostorWinTimer,
    showTaskPopup,
    handleShowTaskPopup,
}: Props) {
    console.log("GAMEVIEW RENDERED");
    const isImpostor = (currentPlayer?.role == Role.IMPOSTOR || currentPlayer?.role == Role.IMPOSTOR_GHOST);
    const [showMiniMap, setShowMiniMap] = useState(false);
    const [isTimer, setIsTimer] = useState(false);
    const nearbyTasks = useNearbyTasks({tasks: game.tasks, currentPlayerPosition: currentPlayer.position});

    const handleToggleMiniMap = () => {
        setShowMiniMap(!showMiniMap);
    };

    const nearbyPlayers = useNearbyEntities(game?.players || [], currentPlayer as Player, [
        Role.CREWMATE,
        Role.IMPOSTOR,
    ]);
    const nearbyGhosts = useNearbyEntities(game?.players || [], currentPlayer as Player, [
        Role.CREWMATE_GHOST,
        Role.IMPOSTOR_GHOST,
    ]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isImpostor && event.code === "KeyE") {
                handleKill();
            } else if (event.key === "m" || event.key === "M") {
                setShowMiniMap((prev) => !prev);
            } else if (event.code === "KeyR") {
                handleReportBody();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKill, setShowMiniMap]);



    function handleKill() {
        if (!isTimer && nearbyPlayers.length > 0) {
            const playerToKillId = nearbyPlayers[0].id;
            killPlayer(game?.gameCode as string, playerToKillId);

            toast("You killed a crewmate!", {
                position: "bottom-right",
                style: {
                    border: "2px solid black",
                    padding: "16px",
                    color: "black",
                    backgroundColor: "#eF4444",
                },
                icon: "🔪",
            });

            setIsTimer(true);
            setTimeout(() => {
                setIsTimer(false);
            }, 20000);
        }
    }

    function handleReportBody() {
        if (nearbyGhosts.length > 0) {
            const bodyToReportId = nearbyGhosts[0].id;
            if (!game.reportedBodies.includes(bodyToReportId)) {
                reportBody(game.gameCode, bodyToReportId);
            }
        }
    }

    const handleToggleTaskPopup = useCallback(() => {
        if (nearbyTasks.length > 0) {
            if (showTaskPopup) {
                handleShowTaskPopup(false);
                showTaskPopup = false;
                console.log("Show task popup: ", showTaskPopup);
            } else {
                handleShowTaskPopup(true);
                showTaskPopup = true;
                console.log("Show task popup: ", showTaskPopup);
            }
        }
    }, [nearbyTasks]);

    useEffect(() => {
        const handleKeyPress = async (event: KeyboardEvent) => {
            if (!isImpostor && event.key === "e" || event.key === "E") {
                if (nearbyTasks.length === 0) return;
                const response = await MiniGameService.startTask(
                    nearbyTasks[0].taskId,
                    nearbyTasks[0].miniGameId,
                    game.gameCode
                );
                if (response.status === 200) {
                    handleToggleTaskPopup();
                }
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleToggleTaskPopup, nearbyTasks]);



    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-5 lg:p-10">
                <div className="flex-none w-1/4">
                    <RoleInformation role={currentPlayer.role}/>`
                    {isImpostor ?
                        <SabotageList sabotages={game.sabotages} handleImpostorWinTimer={handleImpostorWinTimer}
                                      getSabotagePosition={getSabotagePosition}/>
                        :
                        <TaskList tasks={game.tasks}/>
                    }
                </div>
                <div className="flex-grow flex justify-center">
                    {map ? (
                        <MapDisplay
                            map={map}
                            playerList={game.players}
                            currentPlayer={currentPlayer}
                            tasks={game.tasks}
                            sabotages={game.sabotages ?? []}
                            nearbyTask={nearbyTasks[0]}
                        />
                    ) : (
                        <div>Loading map...</div>
                    )}
                </div>

                <div className="flex-none w-1/4">
                    <div className="mb-32">
                        <MapButton handleToggleMiniMap={handleToggleMiniMap} label="Show MiniMap"/>
                        <PlayerList playerId={currentPlayer.id} playerList={game.players}/>
                        {isImpostor &&
                            <CrewmateCounter playerList={game.players}/>
                        }
                    </div>

                    <div className="flex justify-center">
                        {isImpostor &&
                            <ActionButton
                                onClick={handleKill}
                                buttonclickable={nearbyPlayers.length > 0 && !isTimer}
                                colorActive="bg-red-600"
                            >
                                {isTimer ? "⏳ Kill on cooldown" : "🔪 Kill"}
                            </ActionButton>
                        }
                        <ActionButton
                            onClick={() => handleReportBody()}
                            buttonclickable={
                                nearbyGhosts.length > 0 &&
                                !game.reportedBodies.includes(nearbyGhosts[0].id)
                            }
                            colorActive="bg-cyan-600"
                        >
                            📢 Report Body
                        </ActionButton>
                    </div>
                </div>

                {showMiniMap && (
                    <div className="fixed flex justify-center items-center bg-black bg-opacity-75 z-1000 overflow-auto"
                         onClick={() => setShowMiniMap(false)}>
                        {isImpostor ?
                            <SabotageList sabotages={game.sabotages} handleImpostorWinTimer={handleImpostorWinTimer}
                                          getSabotagePosition={getSabotagePosition}/>
                            :
                            <TaskList tasks={game.tasks}/>
                        }
                        <div
                            className="flex flex-col items-center p-2 bg-white rounded-lg shadow-md justify-center flex-warp"
                            onClick={(e) => e.stopPropagation()}>
                            <MiniMap
                                map={map}
                                playerList={game.players}
                                currentPlayer={currentPlayer}
                                closeMiniMap={() => setShowMiniMap(false)}
                                tasks={game.tasks}
                                sabotages={game.sabotages}
                            />
                        </div>
                    </div>
                )}
                {isImpostor
                    ?
                    <Toaster/>
                    :
                    showTaskPopup ?
                        <TaskGateway
                            miniGameId={nearbyTasks[0].miniGameId}
                            taskId={nearbyTasks[0].taskId}
                            gameCode={game.gameCode}
                            handleTaskCompleted={() => handleTaskCompleted(nearbyTasks[0].taskId)}
                        />
                        : ""
                }


            </div>
        </div>


    )


}