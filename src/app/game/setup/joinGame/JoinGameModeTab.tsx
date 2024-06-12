type Props = {
  label: string;
  isActive: boolean;
  tabIndex: number;
  onGameModeChange(tabIndex: number): void;
};

export default function JoinGameModeTab({
  label,
  isActive,
  tabIndex,
  onGameModeChange,
}: Props) {
  return (
    <div
      className={`px-10 py-4 rounded-lg cursor-pointer border-2 font-semibold text-xl ${
        isActive
          ? "bg-cyan-500 border-cyan-500"
          : "border-gray-700 hover:bg-gray-800"
      }`}
      onClick={() => onGameModeChange(tabIndex)}
    >
      {label}
    </div>
  );
}
