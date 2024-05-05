import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TaskCompletedPopup from "./TaskCompletedPopup";
import MiniGamePasscodeService from "@/services/MiniGamePasscodeService";

type TaskPasscodeProps = {
  taskId: number;
  gameCode: string;
  handleTaskCompleted: (taskId: number) => void;
};

export default function TaskPasscode({
  taskId,
  gameCode,
  handleTaskCompleted,
}: TaskPasscodeProps) {
  const [currentSum, setCurrentSum] = useState<number>(0);
  const [randomSum, setRandomSum] = useState<number>(0);
  const [isShowTaskCompletedPopUp, setIsShowTaskCompletedPopUp] =
    useState<boolean>(false);

  useEffect(() => {
    async function fetchRandomSum() {
      try {
        const response = await MiniGamePasscodeService.getRandomSum(gameCode, taskId);
        setRandomSum(response.data as number);
        setCurrentSum(0);
      } catch (error) {
        console.error("Error fetching random sum:", error);
      }
    }
    fetchRandomSum();
  }, [gameCode, taskId]);

  const handleButtonClick = async (value: number) => {
    try {
      const response = await MiniGamePasscodeService.sumUp(value, taskId, gameCode);
      const newCurrentSum = response.data as number;

      if (newCurrentSum > randomSum) {
        setCurrentSum(0);
        toast("Passcode value exceeded", {
          position: "bottom-right",
          style: {
            border: "2px solid black",
            padding: "16px",
            color: "white",
            backgroundColor: "#eF4444",
          },
          icon: "✖️",
        });
      } else if (newCurrentSum === randomSum) {
        setIsShowTaskCompletedPopUp(true);
        setCurrentSum(0);
      } else {
        setCurrentSum(newCurrentSum);
      }
    } catch (error) {
      console.error("Error sending value:", error);
    }
  };

  const handleReset = async () => {
    try {
      await MiniGamePasscodeService.resetSum(gameCode, taskId);
      setCurrentSum(0);
    } catch (error) {
      console.error("Error resetting sum:", error);
    }
  };

  function onClose() {
    setIsShowTaskCompletedPopUp(false);
    handleTaskCompleted(taskId);
  }

  return (
    <>
      {isShowTaskCompletedPopUp ? (
        <TaskCompletedPopup onClose={onClose} />
      ) : (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
          <div className="bg-black rounded-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Passcode</h2>
            <div className="mb-4">
              <p className="text-lg">Sum to be achieved: {randomSum}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[...Array(9)].map((_, index) => (
                  <button
                      key={index + 1}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded"
                      onClick={() => handleButtonClick(index + 1)}
                      style={{fontSize: "1.3rem"}}
                  >
                    {index + 1}
                  </button>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-lg font-bold">
                Current sum:{" "}
                <span className="bg-transparent px-2 py-2 rounded border border-white">
                  {currentSum}
                </span>
              </p>
            </div>
            <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleReset}
            >
              Reset
            </button>
          </div>
          <Toaster/>
        </div>
      )}
    </>
  );
}
