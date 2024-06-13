import { useState } from "react";

type Props = {
  label: string;
  name: string;
  value: string | number;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  type: string;
  min?: number;
  max?: number;
  required: boolean;
  textOptions?: string[];
  idleOptions?: { value: string; label: string; imgSrc: string }[];
  maxLength?: number;
};

export default function CreateGameFormInputField({
  label,
  name,
  value,
  onChange,
  type,
  min,
  max,
  required,
  textOptions,
  idleOptions,
  maxLength,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue: string) => {
    onChange({
      target: { name, value: optionValue },
    } as React.ChangeEvent<HTMLSelectElement>);
    setIsOpen(false);
  };

  const selectedOption = idleOptions?.find((option) => option.value === value);

  return (
    <div className="mb-4">
      <label className="block text-lg mb-2 text-white font-sans" htmlFor={name}>
        {label}
      </label>
      {textOptions ? (
        <select
          className="font-sans bg-gray-800 border-2 border-gray-700 rounded-lg w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {textOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : idleOptions ? (
        <div className="relative">
          <button
            type="button"
            className="font-sans bg-gray-800 border-2 border-gray-700 rounded-lg w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedOption ? (
              <div className="flex items-center">
                <img
                  src={selectedOption.imgSrc}
                  alt={selectedOption.label}
                  className="w-6 h-6 mr-2"
                />
                {selectedOption.label}
              </div>
            ) : (
              <div className="text-left text-slate-300 font-semibold">
                Choose your color
              </div>
            )}
          </button>
          {isOpen && (
            <ul className="absolute z-10 mt-2 bg-gray-800 border-2 border-gray-700 rounded-lg w-full max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-transparent">
              {idleOptions.map((option) => (
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
      ) : (
        <input
          className="bg-gray-800 appearance-none border-2 border-gray-700 rounded-lg w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          required={required}
          maxLength={maxLength}
        />
      )}
    </div>
  );
}
