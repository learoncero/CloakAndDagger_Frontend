import React, { useState, useEffect } from "react";
import TaskCompletedPopup from "@/app/game/[gameCode]/play/TaskCompletedPopup";
import MiniGameColorSeqService from "@/services/MiniGameColorSeqService";
import toast, { Toaster } from "react-hot-toast";

type TaskColorSeqProps = {
  taskId: number;
  gameCode: string;
  handleTaskCompleted: (taskId: number) => void;
};

export default function TaskColorSeq({
  taskId,
  gameCode,
  handleTaskCompleted,
}: TaskColorSeqProps) {
  const [shuffledColors, setShuffledColors] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isShowTaskCompletedPopUp, setIsShowTaskCompletedPopUp] =
    useState<boolean>(false);
  const [initialColors, setInitialColors] = useState<string[]>([]);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const initialColors = await MiniGameColorSeqService.getInitialColors(
          gameCode,
          taskId
        );
        setInitialColors(initialColors);
        const shuffledColors = await MiniGameColorSeqService.getShuffledColors(
          gameCode,
          taskId
        );
        setShuffledColors(shuffledColors);
      } catch (err) {
        console.error("Failed to fetch shuffled colors:", err);
      }
    };

    initializeGame();
  }, [gameCode, taskId]);

  const handleColorClick = (color: string) => {
    if (selectedColors.length < 4) {
      const newSelectedColors = [...selectedColors, color];
      setSelectedColors(newSelectedColors);
      if (newSelectedColors.length === 4) {
        handleSubmission(newSelectedColors);
      }
    }
  };

  const handleUndo = () => {
    setSelectedColors(selectedColors.slice(0, -1));
  };

  const handleSubmission = async (colors: string[]) => {
    const result = await MiniGameColorSeqService.submitColorSequence(
      colors,
      shuffledColors,
      taskId,
      gameCode
    );
    if (result) {
      setIsShowTaskCompletedPopUp(true);
    } else {
      toast("Wrong color sequence", {
        position: "top-center",
        style: {
          border: "2px solid black",
          padding: "16px",
          color: "white",
          backgroundColor: "#eF4444",
        },
        icon: "✖️",
      });
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="flex flex-col items-center bg-black rounded-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Task: Color Code</h2>
            <p className="text-lg">Right order:</p>
            <div className="flex gap-2 mt-2 mb-6">
              {shuffledColors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            <p className="text-lg">Select the right order of Colors:</p>
            <div className="flex gap-2 mt-2 mb-6">
              {initialColors.map((color, index) => (
                <div
                  key={index}
                  className="cursor-pointer w-12 h-12 rounded hover:border-white hover:border hover:border-2"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(color)}
                ></div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {selectedColors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            <div className="flex w-full justify-between mt-4 gap-2">
              <button
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-lg"
                onClick={handleUndo}
              >
                Undo
              </button>
            </div>
          </div>
          <Toaster />
        </div>
      )}
    </>
  );
}
