import React, { useState } from "react";

type Props = {
  role: string;
  onClose(): void;
};

export default function Manual({ role, onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      {/* Gray overlay */}
      <div className="fixed inset-0 bg-gray-900 opacity-75"></div>
      {/* Manual Content */}
      <div className="relative rounded-lg p-8 text-white border border-white content-center bg-black">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 text-white text-lg"
        >
          Close
        </button>
        <div className="flex justify-center">
          <h2 className="text-5xl text-cyan-500 font-bold text-center my-10">
            {role === "CREWMATE" ? "CREWMATE" : "IMPOSTOR"} MANUAL
          </h2>
        </div>
        <div className="text-white">
          {" "}
          {(role === "CREWMATE" || role === "CREWMATE_GHOST") && (
            <div>
              <p className="mb-4">
                As a Crewmate, your objective is to complete tasks and identify
                the impostors among the crew.
              </p>
              <h2 className="font-semibold underline mb-2">Instructions</h2>
              <ul className="list-disc list-inside">
                <li>Work with your crewmates to complete tasks.</li>
                <li>Identify the Impostors and vote them out.</li>
                <li>Stay alert and report any suspicious behavior.</li>
              </ul>
              <h2 className="font-semibold underline mb-2 mt-4">Shortcuts</h2>
              <ul className="list-disc list-inside">
                <li>Move: W A S D</li>
                <li>Show Minimap: M | Q</li>
                <li>Show Manual: H</li>
                <li>Start/Cancel Task: E</li>
                <li>Cancel Sabotage: C</li>
                <li>Report Dead Body: R</li>
              </ul>
            </div>
          )}
          {role === "IMPOSTOR" && (
            <div>
              <p className="mb-4">
                As an Impostor, your objective is to eliminate Crewmates and
                sabotage the ship without being caught.
              </p>
              <h2 className="font-semibold underline mb-2">Instructions</h2>
              <ul className="list-disc list-inside">
                <li>Blend in with the Crewmates.</li>
                <li>Sabotage vital systems to cause chaos.</li>
                <li>Eliminate Crewmates without getting caught.</li>
              </ul>
              <h2 className="font-semibold underline mb-2 mt-4">Shortcuts</h2>
              <ul className="list-disc list-inside">
                <li>Move: W A S D</li>
                <li>Show Minimap: M | Q</li>
                <li>Show Manual: H</li>
                <li>Kill: E</li>
                <li>Cancel Sabotage: C</li>
                <li>Report Dead Body: R</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
