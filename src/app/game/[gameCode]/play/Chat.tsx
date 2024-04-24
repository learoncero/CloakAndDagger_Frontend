import React from "react";

type Props = {
  onClose: () => void;
};

export default function Chat({ onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div className="max-w-lg w-full p-10 text-white border border-white rounded-lg relative">
        <button
          className="absolute top-0 right-0 text-white text-lg p-2"
          onClick={onClose}
        >
          Close
        </button>
        <p className="text-lg">This is the chat placeholder</p>
      </div>
    </div>
  );
}
