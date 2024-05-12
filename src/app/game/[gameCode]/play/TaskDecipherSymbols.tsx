import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import TaskCompletedPopup from "./TaskCompletedPopup";
import MiniGameDecipherSymbolsService from "@/services/MiniGameDecipherSymbolsService";

type TaskDecipherSymbolsProps = {
  taskId: number;
  gameCode: string;
  handleTaskCompleted: (taskId: number) => void;
};

export default function TaskDecipherSymbols({
                                              taskId,
                                              gameCode,
                                              handleTaskCompleted,
                                            }: TaskDecipherSymbolsProps) {
  const [shuffledSymbols, setShuffledSymbols] = useState<string[]>([]);
  const [correctSymbol, setCorrectSymbol] = useState<string>("");
  const [isShowTaskCompletedPopUp, setIsShowTaskCompletedPopUp] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [clickedButtonIndex, setClickedButtonIndex] = useState<number>(-1);

  const startRound = useCallback(async () => {
    const shuffledSymbolsData =
        await MiniGameDecipherSymbolsService.getShuffledSymbols(
            gameCode,
            taskId,
            currentRound
        );
    setShuffledSymbols(shuffledSymbolsData.data as string[]);
    const randomSymbolData =
        await MiniGameDecipherSymbolsService.getCorrectSymbol(
            gameCode,
            taskId
        );
    setCorrectSymbol(randomSymbolData.data as string);
  }, [currentRound, gameCode, taskId]);

  useEffect(() => {
    startRound();
  }, [startRound]);

  const handleSymbolClick = async (symbol: string, index: number) => {
    if (clickedButtonIndex !== -1) return;
    setClickedButtonIndex(index);
    const submitData =
        await MiniGameDecipherSymbolsService.submitDecipherSymbol(
            gameCode,
            taskId,
            symbol,
            currentRound
        );

    if (submitData.data) {
      if (currentRound < 3) {
        setTimeout(() => {
          setCurrentRound(currentRound + 1);
          setClickedButtonIndex(-1);
        }, 250);
      } else {
        console.log("Task completed");
        setIsShowTaskCompletedPopUp(true);
      }
    } else {
      toast.error("Incorrect symbol chosen!", {
        position: "top-center",
        style: {
          border: "2px solid black",
          padding: "16px",
          color: "white",
          backgroundColor: "#eF4444",
        },
        icon: "✖️",
      });

      setCurrentRound(1);
      setClickedButtonIndex(-1);
    }
  };

  const onClose = () => {
    setIsShowTaskCompletedPopUp(false);
    handleTaskCompleted(taskId);
  };

  const renderSymbolButtons = () => {
    const roundSize = currentRound + 2;
    const symbolsPool = shuffledSymbols.slice(0, roundSize * roundSize);
    switch (roundSize) {
      case 3:
        return (
            <div className={`grid grid-cols-3 gap-4 mb-4`}>
              {symbolsPool.map((symbol, index) => (
                  <button
                      key={index}
                      className={`text-white font-bold py-4 px-6 rounded ${
                          index === clickedButtonIndex ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                      }`}
                      onClick={() => handleSymbolClick(symbol, index)}
                      style={{ fontSize: "1.3rem" }}
                  >
                    {symbol}
                  </button>
              ))}
            </div>
        );
      case 4:
        return (
            <div className={`grid grid-cols-4 gap-4 mb-4`}>
              {symbolsPool.map((symbol, index) => (
                  <button
                      key={index}
                      className={`text-white font-bold py-4 px-6 rounded ${
                          index === clickedButtonIndex ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                      }`}
                      onClick={() => handleSymbolClick(symbol, index)}
                      style={{fontSize: "1.3rem"}}
                  >
                    {symbol}
                  </button>
              ))}
            </div>
        );
      case 5:
        return (
            <div className={`grid grid-cols-5 gap-4 mb-4`}>
              {symbolsPool.map((symbol, index) => (
                  <button
                      key={index}
                      className={`text-white font-bold py-4 px-6 rounded ${
                          index === clickedButtonIndex ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                      }`}
                      onClick={() => handleSymbolClick(symbol, index)}
                      style={{fontSize: "1.3rem"}}
                  >
                    {symbol}
                  </button>
              ))}
            </div>
        );
      default:
        return null;
    }
  };

  return (
      <>
        {isShowTaskCompletedPopUp ? (
            <TaskCompletedPopup onClose={onClose}/>
        ) : (
            <div
                className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
              <div className="bg-black rounded-lg p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4">Decipher Symbols</h2>
                <h3 className="text-2xl font-bold mb-4">Round {currentRound}</h3>
                <div className="mb-4">
                  <p className="text-lg">Find: {correctSymbol}</p>
                </div>
                {renderSymbolButtons()}
              </div>
              <Toaster />
            </div>
        )}
      </>
  );
}
