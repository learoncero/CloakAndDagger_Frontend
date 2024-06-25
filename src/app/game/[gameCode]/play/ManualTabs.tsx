import React, { useState } from "react";

type Props = {
  setActiveTab: (tab: string) => void;
  activeTab: string;
};

export default function ManualTabs({ setActiveTab, activeTab }: Props) {
  return (
    <div className="flex justify-center mb-4 gap-5">
      <button
        onClick={() => setActiveTab("CREWMATE")}
        className={`px-4 py-2 ${
          activeTab === "CREWMATE" ? "bg-cyan-500" : "bg-gray-700"
        } text-white rounded-lg`}
      >
        Crewmate
      </button>
      <button
        onClick={() => setActiveTab("IMPOSTOR")}
        className={`px-4 py-2 ${
          activeTab === "IMPOSTOR" ? "bg-cyan-500" : "bg-gray-700"
        } text-white rounded-lg`}
      >
        Impostor
      </button>
    </div>
  );
}
