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
  options?: string[];
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
  options,
}: Props) {
  return (
    <div className="mb-4">
      <label className="block text-lg mb-2 text-white" htmlFor={name}>
        {label}
      </label>
      {options ? (
        <select
          className="bg-gray-800 appearance-none border-2 border-gray-700 rounded-lg w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
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
        />
      )}
    </div>
  );
}
