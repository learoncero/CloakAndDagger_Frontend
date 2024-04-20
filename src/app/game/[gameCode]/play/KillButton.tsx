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
      className={`py-5 px-8 text-xl font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
        buttonclickable ? "bg-red-700" : "bg-gray-500 cursor-default"
      }`}
      onClick={handleKill}
      disabled={!buttonclickable}
    >
      {children}
    </button>
  );
}
