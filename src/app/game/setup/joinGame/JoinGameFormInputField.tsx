type Props = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder: string;
  required: boolean;
  maxLength?: number;
};

export default function JoinGameFormInputField({
  name,
  value,
  onChange,
  type,
  placeholder,
  required,
  maxLength,
}: Props) {
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
