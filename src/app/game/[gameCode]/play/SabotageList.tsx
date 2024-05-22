import { useEffect, useState } from "react";
import SabotageListItem from "./SabotageListItem";
import { Sabotage } from "@/app/types";

type Props = {
  sabotages: Sabotage[];
  getSabotagePosition: (sabotageId: number) => void;
};

export default function SabotageList({
  sabotages,
  getSabotagePosition,
}: Props) {
  const [isSabotageCooldown, setIsSabotageCooldown] = useState(false);
  const [sabotageCooldownTime, setSabotageCooldownTime] = useState(60);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (isSabotageCooldown) {
      countdownInterval = setInterval(() => {
        setSabotageCooldownTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [isSabotageCooldown]);

  function handleSabotageActivation(sabotageId: number) {
    if (!isSabotageCooldown) {
      getSabotagePosition(sabotageId); //sends id back to page to make a fetch for random position
      setIsSabotageCooldown(true);
      setTimeout(() => {
        setIsSabotageCooldown(false);
        setSabotageCooldownTime(60);
      }, 60000);
    }
  }


  return (
    <div className="relative">
      {isSabotageCooldown && (
        <div className="absolute inset-0 bg-gray-500 opacity-50 flex justify-center items-center z-10 max-w-lg rounded-lg">
          <div className={"text-white text-lg font-semibold"}>
            Cooldown {sabotageCooldownTime}s
          </div>
        </div>
      )}
      <div className="relative bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-lg min-h-64">
        <h2 className="text-lg font-semibold mb-4">Sabotages</h2>
        <ul className="overflow-x-hidden">
          {sabotages.map((sabotage) => (
            <SabotageListItem
              key={sabotage.id}
              sabotage={sabotage}
              onActivate={() => handleSabotageActivation(sabotage.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
