import React from "react";

type Props = {
  handleToggleMiniMap: () => void;
  label: string;
};

export default function MapButton({ handleToggleMiniMap, label }: Props) {
  return (
    <button
      className="bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg mb-8"
      onClick={handleToggleMiniMap}
    >
      {label}
    </button>
  );
}
