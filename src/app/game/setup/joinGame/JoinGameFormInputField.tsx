import React, { ChangeEvent, useState } from "react";

type Props = {
  name: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void;
  type: string;
  placeholder: string;
  required: boolean;
  maxLength?: number;
  options?: { value: string; label: string; imgSrc: string }[];
};

export default function JoinGameFormInputField({
  name,
  value,
  onChange,
  type,
  placeholder,
  required,
  maxLength,
  options = [],
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue: string) => {
    onChange({
      target: { name, value: optionValue },
    } as React.ChangeEvent<HTMLSelectElement>);
    setIsOpen(false);
  };

  const selectedOption = options?.find((option) => option.value === value);

  if (type === "select") {
    return (
      <div className="mb-4">
        <div className="relative">
          <button
            type="button"
            className="w-full bg-transparent border border-white text-white font-bold py-3 rounded-lg text-xl text-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedOption ? (
              <div className="flex items-center justify-center">
                <img
                  src={selectedOption.imgSrc}
                  alt={selectedOption.label}
                  className="w-6 h-6 mr-2"
                />
                {selectedOption.label}
              </div>
            ) : (
              <div className="text-center text-slate-300">
                Choose your color
              </div>
            )}
          </button>
          {isOpen && (
            <ul className="absolute z-10 mt-2 bg-gray-800 border-2 max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-transparent border-gray-700 rounded-lg w-full">
              {options.map((option) => (
                <li
                  key={option.value}
                  className="flex items-center py-2 px-4 text-white hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleOptionClick(option.value)}
                >
                  <img
                    src={option.imgSrc}
                    alt={option.label}
                    className="w-6 h-6 mr-2"
                  />
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="mb-4">
        <input
          className="w-full bg-transparent border border-white text-white font-bold py-3 rounded-lg text-xl text-center"
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
        />
      </div>
    );
  }
}
