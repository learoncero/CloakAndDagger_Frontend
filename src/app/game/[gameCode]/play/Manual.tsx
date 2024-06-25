import { useState } from "react";
import ManualCrewmateContent from "./ManualCrewmateContent";
import ManualHeading from "./ManualHeading";
import ManualImpostorContent from "./ManualImpostorContent";
import ManualTabs from "./ManualTabs";

type Props = {
  role?: string;
  onClose(): void;
};

export default function Manual({ role, onClose }: Props) {
  const [activeTab, setActiveTab] = useState("CREWMATE");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      {/* Gray overlay */}
      <div className="fixed inset-0 bg-gray-900 opacity-75"></div>
      {/* Manual Content */}
      <div className="relative rounded-lg p-8 text-white border border-white content-center bg-black max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 text-white text-lg"
        >
          Close
        </button>
        <ManualHeading role={role} />
        <div className="text-white">
          {" "}
          {(role === "CREWMATE" || role === "CREWMATE_GHOST") && (
            <ManualCrewmateContent />
          )}
          {(role === "IMPOSTOR" || role === "IMPOSTOR_GHOST") && (
            <ManualImpostorContent />
          )}
          {(role === null || role === undefined) && (
            <>
              <ManualTabs setActiveTab={setActiveTab} activeTab={activeTab} />
              {activeTab === "CREWMATE" && <ManualCrewmateContent />}
              {activeTab === "IMPOSTOR" && <ManualImpostorContent />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
