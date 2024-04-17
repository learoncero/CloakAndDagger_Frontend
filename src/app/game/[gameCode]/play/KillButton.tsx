type Props = {
  handleKill(): void;
  isPlayerNearby: boolean;
  isTimer: boolean;
  children: React.ReactNode;
};

export default function KillButton({
  handleKill,
  isPlayerNearby,
  isTimer,
  children,
}: Props) {
  const buttonclickable = isPlayerNearby && !isTimer;
  return (
    <button
      className={`px-4 py-2 rounded-md text-black font-semibold ${
        buttonclickable ? "bg-red-600" : "bg-gray-500 cursor-default"
      }`}
      onClick={handleKill}
      disabled={!buttonclickable}
    >
      {children}
    </button>
  );
}
