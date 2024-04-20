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
      className={`py-5 px-8 text-xl font-semibold rounded-lg shadow-lg ${
        buttonclickable ? "bg-red-700" : "bg-gray-500"
      }`}
      onClick={handleKill}
      disabled={!buttonclickable}
    >
      {children}
    </button>
  );
}
