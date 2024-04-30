import { useEffect, useState } from "react";
import SabotageListItem from "./SabotageListItem";
import { Sabotage } from "@/app/types";

type Props = {
  sabotages: Sabotage[];
  handleImpostorWinTimer: () => void;
  getSabotagePosition: (sabotageId: number) => void
};

export default function SabotageList({ sabotages, handleImpostorWinTimer, getSabotagePosition}: Props) {
  const [incompleteSabotages, setIncompleteSabotages] =
    useState<Sabotage[]>(sabotages);
  const [completedSabotages, setCompletedSabotages] = useState<Sabotage[]>([]);
  const [isSabotageCooldown, setIsSabotageCooldown] = useState(false);
  const [sabotageCooldownTime, setSabotageCooldownTime] = useState(30);


  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (isSabotageCooldown) {
      countdownInterval = setInterval(() => {
        setSabotageCooldownTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [isSabotageCooldown]);

  function handleSabotageComplete(sabotageId: number) {
    if (!isSabotageCooldown) {
      handleImpostorWinTimer();
      const sabotageIndex = incompleteSabotages.findIndex(
        (sabotage) => sabotage.id === sabotageId
      );
      if (sabotageIndex !== -1) {
        const completedSabotage = incompleteSabotages[sabotageIndex];
        setCompletedSabotages([...completedSabotages, completedSabotage]);
        const updatedSabotages = incompleteSabotages.filter(
          (sabotage) => sabotage.id !== sabotageId
        );

        getSabotagePosition(sabotageId); //sends id back to page to make a fetch for random position
        setIncompleteSabotages(updatedSabotages);
        setIsSabotageCooldown(true);
        setTimeout(() => {
          setIsSabotageCooldown(false);
          setSabotageCooldownTime(30);
        }, 30000);

      }
    }
  }

  const displayedSabotages = incompleteSabotages.slice(0, 2);

  return (
    <div className="relative">
      {isSabotageCooldown && (
        <div className="absolute inset-0 bg-gray-500 opacity-50 flex justify-center items-center">
          <div className={"text-white text-lg font-semibold"}>
            Cooldown {sabotageCooldownTime}s
          </div>
        </div>
      )}
      <div className="bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-lg min-h-64">
        <h2 className="text-lg font-semibold mb-4">Sabotages</h2>
        <ul className="overflow-x-hidden">
          {displayedSabotages.map((sabotage) => (
            <SabotageListItem
              key={sabotage.id}
              sabotage={sabotage}
              onComplete={() => handleSabotageComplete(sabotage.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
