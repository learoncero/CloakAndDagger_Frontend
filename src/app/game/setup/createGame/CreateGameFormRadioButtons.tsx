import React, { useState } from "react";

export default function CreateGameFormRadioButton() {
  const [selectedOption, setSelectedOption] = useState("private");

  const handleOptionChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedOption(event.target.value);
  };

  return (
    <ul className="grid w-full gap-6 md:grid-cols-2 mb-4">
      <li>
        <input
          type="radio"
          id="private"
          name="private"
          value="private"
          className="hidden peer"
          checked={selectedOption === "private"}
          onChange={handleOptionChange}
        />
        <label
          htmlFor="private"
          className={`inline-flex items-center justify-between w-full p-2 rounded-lg cursor-pointer border-2  ${
            selectedOption === "private"
              ? "bg-cyan-500 border-cyan-500"
              : "border-gray-700 hover:bg-gray-800"
          }`}
        >
          <div className="flex justify-center items-center w-full">
            <div className="text-lg font-semibold">PRIVATE</div>
          </div>
        </label>
      </li>
      <li>
        <input
          type="radio"
          id="public"
          name="public"
          value="public"
          className="hidden peer"
          checked={selectedOption === "public"}
          onChange={handleOptionChange}
          required
        />
        <label
          htmlFor="public"
          className={`inline-flex items-center justify-between w-full p-2 rounded-lg cursor-pointer border-2 ${
            selectedOption === "public"
              ? "bg-cyan-500 border-cyan-500"
              : "border-gray-700 hover:bg-gray-800"
          }`}
        >
          <div className="flex justify-center items-center w-full">
            <div className="text-lg font-semibold">PUBLIC</div>
          </div>
        </label>
      </li>
    </ul>
  );
}
