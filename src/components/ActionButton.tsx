type Props = {
  onClick(): void;
  children: React.ReactNode;
  buttonclickable: boolean;
  colorActive: string;
};

export default function ActionButton({
  onClick,
  children,
  buttonclickable,
  colorActive,
}: Props) {
  return (
    <button
      className={`px-4 py-2 rounded-md text-black font-semibold ${
        buttonclickable ? colorActive : "bg-gray-500 cursor-default"
      }`}
      onClick={onClick}
      disabled={!buttonclickable}
    >
      {children}
    </button>
  );
}
